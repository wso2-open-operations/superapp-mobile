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
 * Generates a request body string for different content types.
 */
const createAuthRequestBody = (
  params: Record<string, any>,
  contentType:
    | "application/x-www-form-urlencoded"
    | "application/json"
    | "text/plain"
): string => {
  // Remove undefined or null values from the request parameters
  const filteredParams = Object.entries(params).reduce(
    (result, [key, value]) => {
      if (value !== undefined && value !== null) result[key] = value;
      return result;
    },
    {} as Record<string, any>
  );

  switch (contentType) {
    // JSON content type: stringify the filtered parameters
    case "application/json":
      return JSON.stringify(filteredParams);

    // Text/plain: convert params to plain format
    case "text/plain":
      return Object.entries(filteredParams)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

    // x-www-form-urlencoded: URL-encode each value
    case "application/x-www-form-urlencoded":
      const encodedParams = Object.entries(filteredParams).reduce(
        (encodedResult, [key, value]) => {
          encodedResult[key] = String(value);
          return encodedResult;
        },
        {} as Record<string, string>
      );
      return new URLSearchParams(encodedParams).toString();

    default:
      throw new Error(`Invalid content type: ${contentType}`);
  }
};

export default createAuthRequestBody;
