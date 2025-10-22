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
interface AuthRequestBodyProps {
  grantType: string;
  code?: string;
  redirectUri?: string;
  clientId?: string;
  codeVerifier?: string;
  refreshToken?: string;
  subjectToken?: string;
  subjectTokenType?: string;
  requestedTokenType?: string;
  scope?: string;
}

export const createAuthRequestBody = (
  {
    grantType,
    code,
    redirectUri,
    clientId,
    codeVerifier,
    refreshToken,
    subjectToken,
    subjectTokenType,
    requestedTokenType,
    scope,
  }: AuthRequestBodyProps,
  requestFormat: string
): string | Record<string, any> => {
  const baseBody = {
    grant_type: grantType,
    ...(code && { code }),
    ...(redirectUri && { redirect_uri: redirectUri }),
    ...(clientId && { client_id: clientId }),
    ...(codeVerifier && { code_verifier: codeVerifier }),
    ...(refreshToken && { refresh_token: refreshToken }),
    ...(subjectToken && { subject_token: subjectToken }),
    ...(subjectTokenType && { subject_token_type: subjectTokenType }),
    ...(requestedTokenType && { requested_token_type: requestedTokenType }),
    ...(scope && { scope }),
  };

  switch (requestFormat) {
    case "application/json":
      return baseBody;

    case "application/x-www-form-urlencoded":
      return new URLSearchParams(baseBody as Record<string, string>).toString();

    case "text/plain":
      return Object.entries(baseBody)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => `${key}=${value}`)
        .join("\n");

    default:
      throw new Error(`Unsupported request format: ${requestFormat}`);
  }
};
