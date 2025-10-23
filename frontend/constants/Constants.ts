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

import { Platform } from "react-native";

export const CLIENT_ID = process.env.EXPO_PUBLIC_CLIENT_ID ?? "";
export const REDIRECT_URI = process.env.EXPO_PUBLIC_REDIRECT_URI ?? "";
export const TOKEN_URL = process.env.EXPO_PUBLIC_TOKEN_URL ?? "";
export const LOGOUT_URL = process.env.EXPO_PUBLIC_LOGOUT_URL ?? "";
export const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_BASE_URL ?? "";
export const MICRO_APP_STORAGE_DIR =
  process.env.EXPO_PUBLIC_MICRO_APP_STORAGE_DIR ?? "";
export const ARTICLE_BASE_URL = process.env.EXPO_PUBLIC_ARTICLE_BASE_URL ?? "";
export const LIBRARY_URL = process.env.EXPO_PUBLIC_LIBRARY_URL ?? "";
export const GOOGLE_IOS_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? "";
export const GOOGLE_ANDROID_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ?? "";
export const GOOGLE_WEB_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? "";
export const GOOGLE_ACCESS_TOKEN_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_ACCESS_TOKEN_KEY ?? "";
export const GOOGLE_REFRESH_TOKEN_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_REFRESH_TOKEN_KEY ?? "";
export const GOOGLE_USER_INFO_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_USER_INFO_KEY ?? "";
export const LIBRARY_ARTICLE_FALLBACK_IMAGE =
  process.env.EXPO_PUBLIC_LIBRARY_ARTICLE_FALLBACK_IMAGE ?? "";
export const DEVELOPER_APP_DEFAULT_URL =
  process.env.EXPO_PUBLIC_DEVELOPER_APP_DEFAULT_URL ?? "";
export const ENABLE_FIREBASE =
  process.env.EXPO_PUBLIC_ENABLE_FIREBASE === "true";
export const GOOGLE_SCOPES = [
  "openid",
  "profile",
  "email",
  "https://www.googleapis.com/auth/drive.appdata",
];
export const GOOGLE_USER_INFO_URL =
  process.env.EXPO_PUBLIC_GOOGLE_USER_INFO_URL ?? "";
export const GOOGLE_TOKEN_URL = process.env.EXPO_PUBLIC_GOOGLE_TOKEN_URL ?? "";
export const GOOGLE_DRIVE_UPLOAD_URL =
  process.env.EXPO_PUBLIC_GOOGLE_DRIVE_UPLOAD_URL ?? "";
export const GOOGLE_DRIVE_LIST_FILES_URL =
  process.env.EXPO_PUBLIC_GOOGLE_DRIVE_LIST_FILES_URL ?? "";
export const GOOGLE_DRIVE_FILE_DOWNLOAD_URL = (fileId: string) =>
  `${
    process.env.EXPO_PUBLIC_GOOGLE_DRIVE_FILE_DOWNLOAD_URL ?? ""
  }${fileId}?alt=media`;
export const GOOGLE_TOKEN_INFO_URL = (accessToken: string) =>
  `${process.env.EXPO_PUBLIC_GOOGLE_TOKEN_INFO_URL ?? ""}${accessToken}`;
export const EVENTS_URL = process.env.EXPO_PUBLIC_EVENTS_URL ?? "";
export const LOCAL_NOTIFICATIONS_KEY =
  process.env.EXPO_PUBLIC_LOCAL_NOTIFICATIONS_KEY ?? "";
export const NOTIFICATION_LEAD_TIME_MINUTES = 10;

export const SUCCESS = "success";
export const APPS = "apps";
export const AUTH_DATA = "authData";
export const DOWNLOADED = "downloaded";
export const NOT_DOWNLOADED = "not-downloaded";
export const USER_CONFIGURATIONS = "user-configurations";
export const APP_LIST_CONFIG_KEY = "superapp.apps.list";
export const USER_INFO = "user-info";
export const LAST_ACTIVE_PATH_KEY = "last-active-path";
export const LIBRARY_STORAGE_KEY = "cached_library_feed";
export const LIBRARY_TIMESTAMP_KEY = "cached_library_timestamp";
export const LIBRARY_ARTICLE_FETCH_LIMIT = 12;
export const EVENTS_STORAGE_KEY = "cached_events_feed";
export const EVENTS_TIMESTAMP_KEY = "cached_events_timestamp";
export const NEWS_URL = process.env.EXPO_PUBLIC_NEWS_URL ?? "";
export const NEWS_STORAGE_KEY = "cached_news_feed";
export const NEWS_TIMESTAMP_KEY = "cached_news_timestamp";
export const isAndroid = Platform.OS === "android";
export const isIos = Platform.OS === "ios";
export const FULL_SCREEN_VIEWING_MODE = "fullscreen";
export const DEFAULT_VIEWING_MODE = "default";

// Keys for Secure Store
export const LAST_SENT_FCM_TOKEN = "last_sent_fcm_token";
export const ACCESS_TOKEN = "secure_access_token";
export const REFRESH_TOKEN = "secure_refresh_token";
export const ID_TOKEN = "secure_id_token";
export const EXPIRES_AT_KEY = "secure_expires_at";
export const AUTH_EMAIL_KEY = "secure_auth_email";

// Notifee Channel ID and Name
export const NOTIFICATION_CHANNEL_ID =
  process.env.EXPO_PUBLIC_NOTIFICATION_CHANNEL_ID ??
  "default_superapp_notification_channel";
export const NOTIFICATION_CHANNEL_NAME =
  process.env.EXPO_PUBLIC_NOTIFICATION_CHANNEL_NAME ??
  "Default SuperApp Notification Channel";
