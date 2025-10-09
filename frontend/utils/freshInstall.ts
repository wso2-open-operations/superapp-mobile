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
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  ID_TOKEN,
  EXPIRES_AT_KEY,
  AUTH_EMAIL_KEY,
  GOOGLE_USER_INFO_KEY,
  GOOGLE_ACCESS_TOKEN_KEY,
  GOOGLE_REFRESH_TOKEN_KEY,
} from "@/constants/Constants";

const INSTALL_MARKER = "install_marker_v1";
/**
 * Wipes SecureStore only on a true fresh install using an AsyncStorage “install marker”.
 * Used because SecureStore can persist across app reinstalls, leaving stale auth secrets.
 * The AsyncStorage marker is a simple, widely used pattern in RN/Expo to detect fresh installs.
 * Ensures a clean, secure baseline before restoring auth or registering push tokens.
 */
export async function handleFreshInstall() {
  const marker = await AsyncStorage.getItem(INSTALL_MARKER);
  if (marker) return; // not a fresh install

  try {
    // Wipe all auth secrets that might have survived uninstall in SecureStore
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN),
      SecureStore.deleteItemAsync(REFRESH_TOKEN),
      SecureStore.deleteItemAsync(ID_TOKEN),
      SecureStore.deleteItemAsync(EXPIRES_AT_KEY),
      SecureStore.deleteItemAsync(AUTH_EMAIL_KEY),
      SecureStore.deleteItemAsync(GOOGLE_ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(GOOGLE_REFRESH_TOKEN_KEY),
      SecureStore.deleteItemAsync(GOOGLE_USER_INFO_KEY),
    ]);
  } catch (error) {
    console.warn("Failed to clear SecureStore", error);
  } finally {
    await AsyncStorage.setItem(INSTALL_MARKER, "1");
  }
}
