export const SESSION_BUILDER_TABS = {
  CAPS_BUILDER: 'new',
  SAVED_CAPS: 'saved',
  ATTACH_TO_SESSION: 'attach',
};

export const SERVER_TYPES = {
  LOCAL: 'local',
  REMOTE: 'remote',
  ADVANCED: 'advanced',
  EXPERITEST: 'experitest',
};

export const SAVED_SESSIONS_TABLE_VALUES = {
  DATE_COLUMN_WIDTH: '25%',
  ACTIONS_COLUMN_WIDTH: '106px',
};

// Placeholder values for specific cloud provider input fields
export const PROVIDER_VALUES = {
  EXPERITEST_ACCESS_KEY: 'accessKey',
  EXPERITEST_URL: 'https://example.experitest.com',
};

export const ADD_CLOUD_PROVIDER_TAB_KEY = 'addCloudProvider';

export const CAPABILITY_TYPES = {
  TEXT: 'text',
  BOOL: 'boolean',
  NUM: 'number',
  OBJECT: 'object',
  // historical
  FILE: 'file',
  JSON_OBJECT: 'json_object',
};

export const STANDARD_W3C_CAPS = [
  'platformName',
  'browserName',
  'browserVersion',
  'acceptInsecureCerts',
  'pageLoadStrategy',
  'proxy',
  'setWindowRect',
  'timeouts',
  'strictFileInteractability',
  'unhandledPromptBehavior',
  'userAgent',
  'webSocketUrl', // WebDriver BiDi
];
