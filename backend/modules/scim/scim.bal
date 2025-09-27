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

# Calls the `searchGroups` function, processes its response, and stores the emails in a string array.
#
# + group - The filter string used to search groups from the SCIM operations service
# + organization - The organization name used to search groups from the SCIM operations service
# + return - An array of email strings, or an error if the operation fails
public isolated function getGroupMemberEmails(string group, string organization) returns string[]|error {
    GroupSearchResponse groupResponse = check searchGroups(group, organization);
    if groupResponse.totalResults == 0 || groupResponse.Resources.length() == 0 {
        return [];
    }
    GroupResource groupResource = groupResponse.Resources[0];
    GroupMember[] members = groupResource.members;
    string[] emails = [];

    from GroupMember member in members
    let string displayName = member.display
    do {
        if displayName.startsWith(STORE_NAME) {
            emails.push(displayName.substring(STORE_NAME.length()));
        } else {
            emails.push(displayName);
        }
    };
    return emails;
}

# Gets the response from the SCIM operations service.
#
# + group - The group name used to search groups from the SCIM operations service
# + organization - The organization name used to search groups from the SCIM operations service
# + return - A `GroupSearchResponse` on success, or an error on failure
public isolated function searchGroups(string group, string organization) returns GroupSearchResponse|error {
    GroupSearchRequest searchRequest = {filter: string `displayName eq ${group}`};
    return check scimClient->/organizations/[organization]/groups/search.post(searchRequest);
}
