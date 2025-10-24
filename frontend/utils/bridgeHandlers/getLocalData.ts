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
import { BridgeFunction } from "../../types/bridge.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
/**
 * Bridge handler: get_local_data
 *
 * Params: { key: string }
 * Resolves: { value: string | null } read from AsyncStorage
 * Rejects: error message string when AsyncStorage.getItem fails
 * Side effects: reads from device local storage
 * Error modes: storage errors are caught and rejected
 */
export const BRIDGE_FUNCTION: BridgeFunction = {
  topic: "get_local_data",
  handler: async (params, context) => {
    try {
      const { key } = params;
      const value = await AsyncStorage.getItem(key);
      context.resolve({ value });
    } catch (error) {
      console.error("Error getting local data:", error);
      const errMessage = error instanceof Error ? error.message : "Unknown error";
      context.reject(errMessage);
    }
  }
};
