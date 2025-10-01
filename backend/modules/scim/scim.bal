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

# Gets the group response from the SCIM operations service.
# 
# + group - The group name used to search groups from the SCIM operations service
# + return - A `GroupSearchResponse` on success, or an error on failure
public isolated function searchInternalGroups(string group) returns GroupSearchResponse|error {
    GroupSearchRequest searchRequest = {filter: string `displayName eq ${group}`};
    return check scimClient->/organizations/internal/groups/search.post(searchRequest);
}
