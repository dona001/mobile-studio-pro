import {SERVER_TYPES} from '../../constants/session-builder';
import {ExperitestVendor} from './experitest.js';
import {LocalVendor} from './local.js';
import {RemoteVendor} from './remote.js';

export const VENDOR_MAP = {
  [SERVER_TYPES.LOCAL]: LocalVendor,
  [SERVER_TYPES.REMOTE]: RemoteVendor,
  [SERVER_TYPES.EXPERITEST]: ExperitestVendor,
};
