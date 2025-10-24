// Copyright (c) 2025 WSO2 LLC. (https://www.wso2.com).
//
// WSO2 LLC. licenses this file to you under the Apache License,
// Version 2.0 (the "License"); you may not use this file except
// in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

// Bridge event topics used for communication between the main app and micro apps.
export const TOPIC = {
  TOKEN: "token",
  QR_REQUEST: "qr_request",
  SAVE_LOCAL_DATA: "save_local_data",
  GET_LOCAL_DATA: "get_local_data",
  ALERT: "alert",
  CONFIRM_ALERT: "confirm_alert",
  TOTP: "totp",
  GOOGLE_LOGIN: "google_login",
  UPLOAD_TO_GOOGLE_DRIVE: "upload_to_google_drive",
  RESTORE_GOOGLE_DRIVE_BACKUP: "restore_google_drive_backup",
  GOOGLE_USER_INFO: "google_user_info",
  CHECK_GOOGLE_AUTH_STATE: "check_google_auth_state",
  CLOSE_WEBVIEW_FROM_MICROAPP: "close_webview",
  NATIVE_LOG: "native_log",
  DEVICE_SAFE_AREA_INSETS: "device_safe_area_insets",
  DELETE_LOCAL_DATA: "delete_local_data",
};

// JavaScript code injected into the WebView to enable communication between
// the micro app and the React Native app via the native bridge.
export const injectedJavaScript = `window.nativebridge = {
    requestToken: () => {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        topic: 'token'
      }));
    },
    requestQr: () => {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        topic: 'qr_request'
      }));
    },
    requestAlert: (title, message, buttonText) => {
      window.ReactNativeWebView.postMessage(JSON.stringify({ 
        topic: "alert", 
        data: { title, message, buttonText } 
      }));
    },
    requestConfirmAlert: (title, message, confirmButtonText, cancelButtonText) => {
      window.ReactNativeWebView.postMessage(JSON.stringify({ 
        topic: "confirm_alert", 
        data: { title, message, confirmButtonText, cancelButtonText } 
      }));
    },
    requestSaveLocalData: (key, value) => window.ReactNativeWebView.postMessage(JSON.stringify({ topic: "save_local_data", data: { key, value } })),
    resolveSaveLocalData: () => console.log("Local data saved successfully"),
    rejectSaveLocalData: (err) => console.error("Save Local Data failed:", err),
    requestGetLocalData: (key) => window.ReactNativeWebView.postMessage(JSON.stringify({ topic: "get_local_data", data: { key } })),
    resolveGetLocalData: (data) => console.log("Local data received:", data),
    rejectGetLocalData: (err) => console.error("Get Local Data failed:", err),
    requestDeleteLocalData: (key) => window.ReactNativeWebView.postMessage(JSON.stringify({ topic: "delete_local_data", data: { key } })),
    resolveDeleteLocalData: () => console.log("Local data deleted successfully"),
    rejectDeleteLocalData: (err) => console.error("Delete Local Data failed:", err),
    requestTotpQrMigrationData: () => window.ReactNativeWebView.postMessage(JSON.stringify({ topic: "totp" })),
    resolveTotpQrMigrationData: (data) => console.log("TOTP QR Migration Data:", data),
    rejectTotpQrMigrationData: (err) => console.error("TOTP Data retrieval failed:", err),
    requestGoogleLogin: () => window.ReactNativeWebView.postMessage(JSON.stringify({ topic: "google_login" })),
    resolveGoogleLogin: (data) => console.log("Google login data received:", data),
    rejectGoogleLogin: (err) => console.error("Google login failed:", err),
    requestUploadToGoogleDrive: (data) => window.ReactNativeWebView.postMessage(JSON.stringify({ topic: "upload_to_google_drive", data })),
    resolveUploadToGoogleDrive: () => console.log("Google Drive upload successful"),
    rejectUploadToGoogleDrive: (err) => console.error("Google Drive upload failed:", err),
    requestRestoreGoogleDriveBackup: () => window.ReactNativeWebView.postMessage(JSON.stringify({ topic: "restore_google_drive_backup" })),
    resolveRestoreGoogleDriveBackup: (data) => console.log("Google Drive backup restored:", data),
    rejectRestoreGoogleDriveBackup: (err) => console.error("Google Drive restore failed:", err),
    requestGoogleAuthState: () => window.ReactNativeWebView.postMessage(JSON.stringify({ topic: "check_google_auth_state" })),
    resolveGoogleAuthState: (data) => console.log("Google Auth State:", data),
    rejectGoogleAuthState: (err) => console.error("Google Auth State check failed:", err),
    requestGoogleUserInfo: () => window.ReactNativeWebView.postMessage(JSON.stringify({ topic: "google_user_info" })),
    resolveGoogleUserInfo: (data) => console.log("Google User Info:", data),
    rejectGoogleUserInfo: (err) => console.error("Google User Info retrieval failed:", err)
  };`;
