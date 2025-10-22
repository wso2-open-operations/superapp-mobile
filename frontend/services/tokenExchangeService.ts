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
import {
  BASE_URL,
  TOKEN_EXCHANGE_CONFIG_STORAGE_KEY,
} from "@/constants/Constants";
import { TokenExchangeConfig } from "@/types/appConfig.types";
import { apiRequest } from "@/utils/requestHandler";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchAndStoreTokenExchangeConfig = async (
  onLogout: () => Promise<void>
): Promise<TokenExchangeConfig | null> => {
  try {
    const response = await apiRequest(
      {
        url: `${BASE_URL}/micro-apps/token-exchange-configs`,
        method: "GET",
      },
      onLogout
    );

    if (response?.data) {
      const tokenExchangeConfig: TokenExchangeConfig = response.data;
      await AsyncStorage.setItem(
        TOKEN_EXCHANGE_CONFIG_STORAGE_KEY,
        JSON.stringify(tokenExchangeConfig)
      );
      return tokenExchangeConfig;
    }
    return null;
  } catch (error) {
    console.error("Error fetching token exchange config:", error);
    return null;
  }
};

export const getStoredTokenExchangeConfig =
  async (): Promise<TokenExchangeConfig | null> => {
    try {
      const storedConfig = await AsyncStorage.getItem(
        TOKEN_EXCHANGE_CONFIG_STORAGE_KEY
      );
      if (storedConfig) {
        return JSON.parse(storedConfig) as TokenExchangeConfig;
      }
      return null;
    } catch (error) {
      console.error("Error retrieving stored token exchange config:", error);
      return null;
    }
  };
