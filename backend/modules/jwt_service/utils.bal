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

import ballerina/crypto;

# Get the hashed client ID.
#
# + clientId - Client ID to be hashed
# + return - Hashed client ID
public isolated function getHashedClientId(string clientId) returns string {
    byte[] data = clientId.toBytes();
    byte[] hash = crypto:hashSha256(data);
    return hash.toBase64();
}

# Get the configured token TTL in seconds.
#
# + return - Token time-to-live in seconds
public isolated function getTokenTTL() returns decimal {
    return tokenTTLSeconds;
}
