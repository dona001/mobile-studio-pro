import JavaFramework from './java-common.js';

export default class JavaOCBCFramework extends JavaFramework {
  static readableName = 'OCBC Framework (Java POM)';
  static highlightLang = 'java';

  constructor(serverUrl, serverUrlParts, caps) {
    super(serverUrl, serverUrlParts, caps);
    this.pageObjects = new Map(); // Store generated page objects
    this.currentPageName = 'DefaultPage';
    this.pageCounter = 0;
  }

  // Generate Page Object Model code instead of raw driver calls
  getCodeString(includeBoilerplate = false) {
    let testCode = '';
    let pageObjectCode = '';

    // Generate test methods for each action
    for (let {action, params} of this.actions) {
      const genCodeFn = `codeFor_${action}`;
      if (!this[genCodeFn]) {
        testCode += this.addComment(
          `Code generation for action '${action}' is not currently supported`,
        );
      } else {
        const code = this[genCodeFn](...params);
        if (code) {
          testCode += `${code}\n`;
        }
      }
    }

    // Generate page object classes
    for (let [pageName, pageData] of this.pageObjects) {
      pageObjectCode += this.generatePageObjectClass(pageName, pageData);
    }

    if (includeBoilerplate) {
      return this.wrapWithBoilerplate(testCode, pageObjectCode);
    }
    return testCode;
  }

  // Generate Page Object class
  generatePageObjectClass(pageName, pageData) {
    const {elements, methods} = pageData;

    let classCode = `
public class ${pageName} {
    private AppiumDriver driver;

`;

    // Generate element declarations with @FindBy annotations
    for (let [elementName, elementData] of elements) {
      const {strategy, locator, javaStrategy} = elementData;
      classCode += `    @FindBy(${javaStrategy} = "${locator}")
    private WebElement ${elementName};

`;
    }

    // Constructor
    classCode += `    public ${pageName}(AppiumDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);
    }

`;

    // Generate methods
    for (let method of methods) {
      classCode += `    ${method}

`;
    }

    classCode += `}
`;

    return classCode;
  }

  // Override element interaction methods to generate Page Object methods
  codeFor_findAndAssign(strategy, locator, localVar, isArray) {
    // Generate a meaningful element name based on locator
    const elementName = this.generateElementName(strategy, locator);
    const javaStrategy = this.getJavaStrategy(strategy);

    // Store element in current page object
    this.addElementToCurrentPage(elementName, strategy, locator, javaStrategy);

    // Generate method call instead of direct element access
    return this.generatePageObjectMethodCall(elementName, 'find');
  }

  codeFor_elementClick(varName, varIndex) {
    const elementName = this.getElementNameFromVar(varName);
    return this.generatePageObjectMethodCall(elementName, 'click');
  }

  codeFor_elementClear(varName, varIndex) {
    const elementName = this.getElementNameFromVar(varName);
    return this.generatePageObjectMethodCall(elementName, 'clear');
  }

  codeFor_elementSendKeys(varName, varIndex, text) {
    const elementName = this.getElementNameFromVar(varName);
    return this.generatePageObjectMethodCall(elementName, 'sendKeys', text);
  }

  // Generate Page Object method calls
  generatePageObjectMethodCall(elementName, action, param = null) {
    const pageName = this.currentPageName;
    const methodName = this.generateMethodName(elementName, action);

    // Add method to page object
    this.addMethodToCurrentPage(elementName, action, param);

    // Generate method call
    if (param) {
      return `${pageName.toLowerCase()}Page.${methodName}(${JSON.stringify(param)});`;
    } else {
      return `${pageName.toLowerCase()}Page.${methodName}();`;
    }
  }

  // Generate meaningful element names
  generateElementName(strategy, locator) {
    // Extract meaningful part from locator
    let name = locator;

    if (strategy === 'id') {
      // Extract last part of ID (e.g., "com.ocbc.app:id/login_button" -> "loginButton")
      const idParts = locator.split(':');
      if (idParts.length > 1) {
        name = idParts[idParts.length - 1];
      }
    } else if (strategy === 'xpath') {
      // Extract text or attribute value for naming
      const textMatch = locator.match(/text\(\)\s*=\s*["']([^"']+)["']/);
      if (textMatch) {
        name = textMatch[1].replace(/[^a-zA-Z0-9]/g, '');
      } else {
        name = 'element';
      }
    }

    // Convert to camelCase
    return this.toCamelCase(name.replace(/[^a-zA-Z0-9]/g, ''));
  }

  // Generate method names
  generateMethodName(elementName, action) {
    const actionMap = {
      click: 'click',
      clear: 'clear',
      sendKeys: 'enter',
      find: 'get',
    };

    const actionName = actionMap[action] || action;
    return `${actionName}${this.capitalize(elementName)}`;
  }

  // Add element to current page object
  addElementToCurrentPage(elementName, strategy, locator, javaStrategy) {
    if (!this.pageObjects.has(this.currentPageName)) {
      this.pageObjects.set(this.currentPageName, {
        elements: new Map(),
        methods: [],
      });
    }

    const pageData = this.pageObjects.get(this.currentPageName);
    pageData.elements.set(elementName, {strategy, locator, javaStrategy});
  }

  // Add method to current page object
  addMethodToCurrentPage(elementName, action, param) {
    const pageData = this.pageObjects.get(this.currentPageName);
    if (!pageData) {
      return;
    }

    const methodName = this.generateMethodName(elementName, action);
    const elementData = pageData.elements.get(elementName);

    if (!elementData) {
      return;
    }

    let methodCode = '';
    if (action === 'click') {
      methodCode = `public void ${methodName}() {
        ${elementName}.click();
    }`;
    } else if (action === 'clear') {
      methodCode = `public void ${methodName}() {
        ${elementName}.clear();
    }`;
    } else if (action === 'sendKeys') {
      methodCode = `public void ${methodName}(String text) {
        ${elementName}.sendKeys(text);
    }`;
    } else if (action === 'find') {
      methodCode = `public WebElement ${methodName}() {
        return ${elementName};
    }`;
    }

    // Avoid duplicate methods
    if (!pageData.methods.includes(methodCode)) {
      pageData.methods.push(methodCode);
    }
  }

  // Get element name from variable name
  getElementNameFromVar(varName) {
    // This is a simplified mapping - in a real implementation,
    // you'd maintain a proper mapping between variables and element names
    return varName.replace('el', 'element');
  }

  // Get Java strategy for @FindBy annotation
  getJavaStrategy(strategy) {
    const strategyMap = {
      id: 'id',
      xpath: 'xpath',
      'accessibility id': 'accessibilityId',
      'class name': 'className',
      name: 'name',
      '-android uiautomator': 'androidUIAutomator',
      '-android datamatcher': 'androidDataMatcher',
      '-android viewtag': 'androidViewTag',
      '-ios predicate string': 'iOSNsPredicateString',
      '-ios class chain': 'iOSClassChain',
    };
    return strategyMap[strategy] || 'id';
  }

  // Utility methods
  toCamelCase(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Override boilerplate to include Page Object imports and setup
  wrapWithBoilerplate(testCode, pageObjectCode) {
    const [pkg, cls, capStr] = this.getBoilerplateParams();

    return `// OCBC Framework - Page Object Model Test
// Generated by OCBC Test Studio
import io.appium.java_client.remote.options.BaseOptions;
import io.appium.java_client.AppiumBy;
import io.appium.java_client.${pkg}.${cls};
import java.net.URL;
import java.net.MalformedURLException;
import java.time.Duration;
import java.util.Arrays;
import java.util.Base64;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.*;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.FindBy;

${pageObjectCode}

public class OCBCSampleTest {

  private ${cls} driver;

  @BeforeEach
  public void setUp() {
    Capabilities options = new BaseOptions()
${capStr};    

    driver = new ${cls}(this.getUrl(), options);
  }

  @Test
  public void testOCBCFlow() {
${this.indent(testCode, 4)}
  }

  @AfterEach
  public void tearDown() {
    driver.quit();
  }
    
  private URL getUrl() {
      try {
        return new URL("${this.serverUrl}");
      } catch (MalformedURLException e) {
        e.printStackTrace();
      }
    }
}
`;
  }

  // Override tap and swipe to use Page Object methods
  codeFor_tap(varNameIgnore, varIndexIgnore, pointerActions) {
    const {x, y} = this.getTapCoordinatesFromPointerActions(pointerActions);
    return `// Tap at coordinates (${x}, ${y})
final var finger = new PointerInput(PointerInput.Kind.TOUCH, "finger");
var tapPoint = new Point(${x}, ${y});
var tap = new Sequence(finger, 1);
tap.addAction(finger.createPointerMove(Duration.ofMillis(0),
    PointerInput.Origin.viewport(), tapPoint.x, tapPoint.y));
tap.addAction(finger.createPointerDown(PointerInput.MouseButton.LEFT.asArg()));
tap.addAction(new Pause(finger, Duration.ofMillis(50)));
tap.addAction(finger.createPointerUp(PointerInput.MouseButton.LEFT.asArg()));
driver.perform(Arrays.asList(tap));`;
  }

  codeFor_swipe(varNameIgnore, varIndexIgnore, pointerActions) {
    const {x1, y1, x2, y2} = this.getSwipeCoordinatesFromPointerActions(pointerActions);
    return `// Swipe from (${x1}, ${y1}) to (${x2}, ${y2})
final var finger = new PointerInput(PointerInput.Kind.TOUCH, "finger");
var start = new Point(${x1}, ${y1});
var end = new Point (${x2}, ${y2});
var swipe = new Sequence(finger, 1);
swipe.addAction(finger.createPointerMove(Duration.ofMillis(0),
    PointerInput.Origin.viewport(), start.getX(), start.getY()));
swipe.addAction(finger.createPointerDown(PointerInput.MouseButton.LEFT.asArg()));
swipe.addAction(finger.createPointerMove(Duration.ofMillis(1000),
    PointerInput.Origin.viewport(), end.getX(), end.getY()));
swipe.addAction(finger.createPointerUp(PointerInput.MouseButton.LEFT.asArg()));
driver.perform(Arrays.asList(swipe));`;
  }
}
