
// Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

# Request record for the SCIM group search request
public type GroupSearchRequest record {|
    # The filter string used to query groups from the SCIM service
    string filter;
|};

# Response record for the SCIM group search response
public type GroupSearchResponse record {|
    # The total number of results that match the request
    int totalResults;
    # The index of the first result returned 
    int startIndex;
    # The number of items returned per page
    int itemsPerPage;
    # The list of SCIM schema URIs 
    string[] schemas;
    # The array of group resources that match the search request
    GroupResource[] Resources;
|};

# Record representing a SCIM group resource returned in a group search response
public type GroupResource record {|
    # The unique identifier of the group
    string id;
    # The display name of the group
    string displayName;
    # The members that belong to the group
    GroupMember[] members;
    # Metadata about the group resource
    GroupMeta meta;
|};

# Record representing a member of a SCIM group resource
public type GroupMember record {|
    # The id of the member
    string value;
    # The email of the member
    string display;
    # The reference URI 
    string \$ref;
|};

# Record representing metadata of a SCIM group resource
public type GroupMeta record {|
    # The timestamp when the group resource was created
    string created;
    # The URI location of the group resource
    string location;
    # The timestamp when the group resource was last modified
    string lastModified;
|};
