// App_Init
export const APP_INIT = "APP_INIT";
export const APP_TITLE = "Template";

// Error Code
export const E_PICKER_CANCELLED = "E_PICKER_CANCELLED";
export const E_PICKER_CANNOT_RUN_CAMERA_ON_SIMULATOR =
  "E_PICKER_CANNOT_RUN_CAMERA_ON_SIMULATOR";
export const E_PERMISSION_MISSING = "E_PERMISSION_MISSING";
export const E_PICKER_NO_CAMERA_PERMISSION = "E_PICKER_NO_CAMERA_PERMISSION";
export const E_USER_CANCELLED = "E_USER_CANCELLED";
export const E_UNKNOWN = "E_UNKNOWN";
export const E_DEVELOPER_ERROR = "E_DEVELOPER_ERROR";
export const TIMEOUT_NETWORK = "ECONNABORTED"; // request service timeout
export const NOT_CONNECT_NETWORK = "NOT_CONNECT_NETWORK";

//////////////// Localization Begin ////////////////
export const NETWORK_CONNECTION_MESSAGE =
  "Cannot connect to server, Please try again.";
export const NETWORK_TIMEOUT_MESSAGE =
  "A network timeout has occurred, Please try again.";
export const UPLOAD_PHOTO_FAIL_MESSAGE =
  "An error has occurred. The photo was unable to upload.";

// export const apiUrl = "http://localhost:2009/api/weightScales/";
// export const apiUrl = "http://192.168.100.168:2009/api/weightScales/";
export const apiUrl = "http://10.10.10.10:2009/api/weightScales/";

export const YES = "YES";
export const NO = "NO";
export const OK = "ok";
export const NOK = "nok";

export const server = {
  LOGIN_URL: `authen/login`,
  REGISTER_URL: `authen/register`,
  USER_URL: `manage_user/user`,
  FIND_USER_URL: `manage_user/find_user`,
  CHANGE_LV_URL: `manage_user/changeLevel`,

  WEIGHT_DEVICES_URL: `master_devices/devices`,
  FIND_WEIGHT_DEVICES_URL: `master_devices/find_devices`,
  FIND_WEIGHT_DEVICE_URL: `master_devices/find_device`,

  WEIGHT_MODELS_URL: 'weight_models/models',
  FIND_WEIGHT_MODELS_URL: `weight_models/find_models`,
  FIND_WEIGHT_MODEL_URL: `weight_models/find_model`,
}

export const key = {
  LOGIN_PASSED: `LOGIN_PASSED`,
  API_KEY: `API_KEY`,
  USER_LV: `USER_LV`,
  USER_NAME: "USER_NAME",
  USER_EMP: "USER_EMP",
  TEMP_EMP: "TEMP_EMP",
  TOKEN: "TOKEN",
};
