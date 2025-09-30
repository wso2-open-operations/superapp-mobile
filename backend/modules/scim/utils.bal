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

# Calls the `searchInternalGroups` function, processes its response, and stores the emails in a string array.
#
# + group - The filter string used to search groups from the SCIM operations service
# + return - An array of email strings, or an error if the operation fails
public isolated function getGroupMemberEmails(string group) returns string[]|error {
    GroupSearchResponse groupResponse = check searchInternalGroups(group);
    if groupResponse.totalResults == 0 || groupResponse.Resources.length() == 0 {
        return [];
    }
    return from GroupMember member in groupResponse.Resources[0].members
        let string displayName = member.display
        select displayName.startsWith(STORE_NAME) ? displayName.substring(STORE_NAME.length()) : displayName;
}
