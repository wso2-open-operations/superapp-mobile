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
import { Middleware } from "@reduxjs/toolkit";
import { createTransform } from "redux-persist";
import type { AppDispatch, RootState } from "@/context/store";
import type { MicroApp } from "@/context/slices/appSlice";
import {
  updateAppStatus,
  updateExchangedToken,
} from "@/context/slices/appSlice";
import { NOT_DOWNLOADED } from "@/constants/Constants";

const KEY_PREFIX = "exchangedToken:";

// SecureStore helpers 
export const setExchangedTokenSecure = async (appId: string, token: string) => {
  await SecureStore.setItemAsync(`${KEY_PREFIX}${appId}`, token);
};

export const getExchangedTokenSecure = async (appId: string) => {
  return SecureStore.getItemAsync(`${KEY_PREFIX}${appId}`);
};

export const deleteExchangedTokenSecure = async (appId: string) => {
  await SecureStore.deleteItemAsync(`${KEY_PREFIX}${appId}`);
};

// Called once after redux-persist rehydrates 
export const restoreExchangedTokens = async (
  getState: () => RootState,
  dispatch: AppDispatch
) => {
  const apps = getState().apps.apps || [];
  for (const app of apps) {
    const token = await getExchangedTokenSecure(app.appId);
    if (token) {
      dispatch(
        updateExchangedToken({ appId: app.appId, exchangedToken: token })
      );
    }
  }
};

// Strips exchangedToken before persisting to AsyncStorage (must be sync) 
export const stripExchangedTokenTransform = createTransform(
  (inbound: { apps: MicroApp[] }) => {
    if (!inbound?.apps) return inbound;
    const apps = inbound.apps.map(({ exchangedToken, ...rest }) => ({
      ...rest,
      exchangedToken: "", // never persist tokens to AsyncStorage
    }));
    return { ...inbound, apps };
  },
  (outbound) => outbound,
  { whitelist: ["apps"] }
);

// Mirrors token writes/deletes to SecureStore 
export const secureTokenMiddleware: Middleware =
  () => (next) => async (action) => {
    const result = next(action);

    // Direct token updates
    if (updateExchangedToken.match(action)) {
      const { appId, exchangedToken } = action.payload;
      if (exchangedToken) {
        await setExchangedTokenSecure(appId, exchangedToken);
      }
    }

    // Status updates may add/clear token 
    if (updateAppStatus.match(action)) {
      const { appId, exchangedToken, status } = action.payload;
      if (typeof exchangedToken === "string") {
        if (exchangedToken) {
          await setExchangedTokenSecure(appId, exchangedToken);
        } else {
          await deleteExchangedTokenSecure(appId);
        }
      }

      if (status === NOT_DOWNLOADED) {
        await deleteExchangedTokenSecure(appId);
      }
    }

    return result;
  };

// Wipe all app tokens (use in global logout) 
export const clearAllAppTokens = async (state: RootState) => {
  const apps = state.apps.apps || [];
  for (const app of apps) {
    await deleteExchangedTokenSecure(app.appId);
  }
};
