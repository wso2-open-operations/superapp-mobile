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

// Centralized constants for API endpoint keys used across the app and tests
// Keeping as string literals to match keys used in api.ts ENDPOINTS
export const API_KEYS = {
  MICROAPPS_LIST: "MICROAPPS_LIST",
  MICROAPPS_UPLOAD: "MICROAPPS_UPLOAD",
  USERS_BASE: "USERS_BASE",
  USERS: "USERS",
} as const;

export type ApiKey = typeof API_KEYS[keyof typeof API_KEYS];
