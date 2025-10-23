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
  GRANT_TYPE_TOKEN_EXCHANGE,
  REQUESTED_TOKEN_TYPE,
  SUBJECT_TOKEN_TYPE,
  TOKEN_URL,
} from "@/constants/Constants";
import {
  IdpRequestData,
  TokenExchangeConfig,
  TokenExchangeData,
  TokenExchangeType,
} from "@/types/tokenExchange.types";

/**
 * Prepare the token exchange payload.
 * You can add support for other types if needed.
 */
export const prepareTokenExchangePayload = (
  type: TokenExchangeType,
  data: TokenExchangeData
): TokenExchangeConfig => {
  switch (type) {
    case TokenExchangeType.IDP:
      const idpData: IdpRequestData = data as IdpRequestData;
      return {
        body: {
          client_id: idpData.clientId,
          grant_type: GRANT_TYPE_TOKEN_EXCHANGE,
          subject_token: idpData.token,
          subject_token_type: SUBJECT_TOKEN_TYPE,
          requested_token_type: REQUESTED_TOKEN_TYPE,
          scope: idpData.selectedScopes,
        },
        tokenUrl: TOKEN_URL || "",
      };

    /**
     *  Placeholder for other token exchange types
     */
    // case TokenExchangeType.Example: data as ExampleType;
    // return {
    //     body:{
    //         ...values
    //     }
    // };

    default:
      throw new Error(`Unsupported token exchange type: ${type}`);
  }
};
