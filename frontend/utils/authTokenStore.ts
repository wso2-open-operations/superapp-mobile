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
import * as SecureStore from "expo-secure-store";
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  ID_TOKEN,
  EXPIRES_AT_KEY,
  AUTH_EMAIL_KEY,
} from "@/constants/Constants";

export type SecureAuthData = {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  email?: string;
  expiresAt: number;
};

export async function saveAuthDataToSecureStore(authData: SecureAuthData) {
  await Promise.all([
    SecureStore.setItemAsync(ACCESS_TOKEN, authData.accessToken),
    SecureStore.setItemAsync(REFRESH_TOKEN, authData.refreshToken),
    SecureStore.setItemAsync(ID_TOKEN, authData.idToken),
    SecureStore.setItemAsync(EXPIRES_AT_KEY, String(authData.expiresAt)),
    authData.email
      ? SecureStore.setItemAsync(AUTH_EMAIL_KEY, authData.email)
      : SecureStore.deleteItemAsync(AUTH_EMAIL_KEY),
  ]);
}

export async function loadAuthDataFromSecureStore(): Promise<SecureAuthData | null> {
  const [accessToken, refreshToken, idToken, expiresAtStr, email] =
    await Promise.all([
      SecureStore.getItemAsync(ACCESS_TOKEN),
      SecureStore.getItemAsync(REFRESH_TOKEN),
      SecureStore.getItemAsync(ID_TOKEN),
      SecureStore.getItemAsync(EXPIRES_AT_KEY),
      SecureStore.getItemAsync(AUTH_EMAIL_KEY),
    ]);

  if (!accessToken || !refreshToken || !idToken || !expiresAtStr) return null;

  return {
    accessToken,
    refreshToken,
    idToken,
    email: email || undefined,
    expiresAt: Number(expiresAtStr),
  };
}

export async function clearAuthDataFromSecureStore() {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN),
    SecureStore.deleteItemAsync(REFRESH_TOKEN),
    SecureStore.deleteItemAsync(ID_TOKEN),
    SecureStore.deleteItemAsync(EXPIRES_AT_KEY),
    SecureStore.deleteItemAsync(AUTH_EMAIL_KEY),
  ]);
}
