import {CLIENT_FRAMEWORKS} from '../../constants/session-inspector.js';
import JavaOCBCFramework from './java-ocbc-generator.js';

export const CLIENT_FRAMEWORK_MAP = {
  [CLIENT_FRAMEWORKS.JAVA_OCBC]: JavaOCBCFramework,
};
