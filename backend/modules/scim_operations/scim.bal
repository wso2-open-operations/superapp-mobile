
// Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

# Calls the `searchGroups` function, processes its response, and stores the emails in a string array.
#
# + filter - The filter string used to search groups from the SCIM operations service
# + organization - The organization name used to search groups from the SCIM operations service
# + return - An array of email strings, or an error if the operation fails
public isolated function getGroupMemberEmails(string filter, string organization) returns string[]|error {
    GroupSearchResponse groupResponse = check searchGroups(filter, organization);

    if groupResponse.totalResults <= 0 || groupResponse.Resources.length() <= 0 {
        return [];
    }

    GroupResource groupResource = groupResponse.Resources[0];

    GroupMember[] members = <GroupMember[]>groupResource.members;
    string[] emails = [];

    from GroupMember member in members
    where member.display is string
    let string displayName = <string>member.display
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
# + filter - The filter string used to search groups from the SCIM operations service
# + organization - The organization name used to search groups from the SCIM operations service
# + return - A `GroupSearchResponse` on success, or an error on failure
public isolated function searchGroups(string filter, string organization) returns GroupSearchResponse|error {
    GroupSearchRequest searchRequest = {filter};

    string endpoint = string `/organizations/${organization}/groups/search`;

    return check scimClient->post(endpoint, searchRequest);
}
