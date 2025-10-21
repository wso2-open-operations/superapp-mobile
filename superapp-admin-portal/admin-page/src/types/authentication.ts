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

// Shared auth-related minimal types used across components and hooks

export interface JWTPayload {
  iss?: string;
  sub?: string;
  aud?: string | string[];
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  scope?: string | string[];
  email?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  groups?: string[] | string;
  roles?: string[] | string;
  role?: string[] | string;
  "http://wso2.org/claims/role"?: string[] | string;
  wso2_role?: string[] | string;
  [claim: string]: unknown;
}

export type AuthContextLike = {
  state?: {
    isAuthenticated?: boolean;
    accessToken?: string | null;
    accessTokenPayload?: JWTPayload | Record<string, unknown> | null;
  };
  getAccessToken?: () => Promise<string | null | undefined>;
  getIDToken?: () => Promise<string | null | undefined>;
  getDecodedIDToken?: () =>
    | Promise<JWTPayload | Record<string, any> | null | undefined>
    | JWTPayload
    | Record<string, any>
    | null
    | undefined;
  getBasicUserInfo?: () => Promise<Record<string, any> | null | undefined>;
  // Sign-out implementations vary across SDKs; allow a flexible signature.
  signOut?: (...args: any[]) => any;
};
