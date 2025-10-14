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

/**
 * API Configuration and Endpoint Management (TypeScript)
 */

// Base API URL for the SuperApp Backend
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";


// Predefined endpoints for different admin portal operations
export const ENDPOINTS: Record<string, string> = {
  MICROAPPS_LIST: `${API_BASE_URL}/`,
  MICROAPPS_UPLOAD: `${API_BASE_URL}/`,
  USERS: `${API_BASE_URL}/`,
};

export type EndpointKey = "MICROAPPS_LIST" | "MICROAPPS_UPLOAD" | "USERS_BASE" | "USERS";

/**
 * Gets the appropriate endpoint URL with environment variable override support.
 * Falls back to defaults and trims trailing slash.
 */
export const getEndpoint = (key: EndpointKey | string): string => {
  const envMap: Record<string, string | undefined> = {
    MICROAPPS_LIST: process.env.REACT_APP_MICROAPPS_LIST_URL,
    MICROAPPS_UPLOAD: process.env.REACT_APP_MICROAPPS_UPLOAD_URL,
    USERS_BASE: process.env.REACT_APP_USERS_BASE_URL,
  };

  const fromEnv = envMap[key];
  const fromDefaults = ENDPOINTS[key as keyof typeof ENDPOINTS];
  return (fromEnv || fromDefaults || API_BASE_URL).replace(/\/$/, "");
};
