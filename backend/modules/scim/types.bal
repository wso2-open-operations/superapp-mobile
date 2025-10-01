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

# [Configurable] OAuth2 entity application configuration.
type Oauth2Config record {|
    # The URL of the token endpoint
    string tokenUrl;
    # The client ID of the application
    string clientId;
    # The client secret of the application
    string clientSecret;
    # The scopes of the application
    string[] scopes;
|};

# Request record for the SCIM group search request.
public type GroupSearchRequest record {|
    # The group name string used to query groups from the SCIM service
    string filter;
|};

# Response record for the SCIM group search response.
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

# Record representing a SCIM group resource returned in a group search response.
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

# Record representing a member of a SCIM group resource.
public type GroupMember record {|
    # The id of the member
    string value;
    # The email of the member
    string display;
    json...;
|};

# Record representing metadata of a SCIM group resource.
public type GroupMeta record {|
    # The timestamp when the group resource was created
    string created;
    # The URI location of the group resource
    string location;
    # The timestamp when the group resource was last modified
    string lastModified;
|};
