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
 * Supported token exchange types.
 * you can extend this enum for other types if needed.
 */
export enum TokenExchangeType {
  Idp = "idp",
  // Add other token exchange types here if needed
  // EXAMPLE = "example"
}

/**
 * Request data for IDP token exchange.
 * This is currently the only type implemented, but you can extend with their own types (Refer Example Interface[1] Below).
 */
export interface IdpRequestData {
  clientId: string;
  token: string;
  selectedScopes: string;
  grantType: string;
  subjectTokenType: string;
  requestedTokenType: string;
}

// Example Interface[1]
// export interface ExampleTokenExchangeTypeRequestData {
//   exampleValue : string;
//   ...
// }

/**
 * Union type for token exchange request data.
 */
export type TokenExchangeData = IdpRequestData; //  | You can add other types if needed (Refer Example[2] below);

// Example[2]
// export export type TokenExchangeData = IdpRequestData | ExampleTokenExchangeTypeRequestData;

/**
 * Configuration returned by token exchange payload generators.
 * Contains the request body and optionally a token URL.
 */
export interface TokenExchangeConfig {
  body: Record<string, any>;
  tokenUrl?: string;
}
