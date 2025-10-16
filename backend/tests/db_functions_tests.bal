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

import superapp_mobile_service.database as db;

import ballerina/io;
import ballerina/test;

// Test case for adding a new micro app with versions and default role
@test:Config
function testAddMicroApp_InsertsSuccessfully() returns error? {

    string uniqueId = "test-leave-app";

    db:MicroApp microApp = {
        name: "Leave App Test",
        description: "A demo micro app for unit testing.",
        promoText: "Initial Release",
        appId: uniqueId,
        iconUrl: "https://example.com/icon.png",
        bannerImageUrl: "https://example.com/banner.png",
        isMandatory: 0,
        versions: [
            {
                version: "1.0.0",
                build: 1,
                releaseNotes: "First release",
                iconUrl: "https://example.com/icon-1.0.0.png",
                downloadUrl: "https://lsf-superapp-test/payslip-viewer.zip"
            }
        ]
    };

    db:ExecutionSuccessResult result = check db:upsertMicroApp(microApp, "test-user@wso2.com");
    io:println("Insert Result: ", result);
    test:assertTrue(result.affectedRowCount > 0, msg = "Expected insert to affect at least one row");
    io:println("Default role 'default' should have been created automatically for: ", uniqueId);
}

// Test case for adding a new micro app version to an existing micro app
@test:Config
function testAddMicroAppVersion() returns error? {
    db:MicroAppVersion version = {
        version: "1.0.0",
        build: 2,
        releaseNotes: "Test bug fixes and improvements. 2nd build of version 1.0.0.",
        iconUrl: "https://example.com/icon-1.0.1.png",
        downloadUrl: "https://lsf-superapp-test/payslip-viewer.zip"
    };
    db:ExecutionSuccessResult result = check db:upsertMicroAppVersion("test-leave-app", version, "test-user@wso2.com");
    io:println("==============================================================");
    io:println("Insert Version Result: ", result);
    test:assertTrue(result.affectedRowCount > 0, msg = "Expected insert to affect at least one row");
}

// Test case for adding a new role mapping to an existing micro app
@test:Config
function testAddMicroAppRole_InsertsSuccessfully() returns error? {
    string appId = "test-leave-app";
    db:MicroAppRole roleMapping = {
        role: "hr-staff"
    };

    db:ExecutionSuccessResult result = check db:upsertMicroAppRole(appId, roleMapping, "test-user@wso2.com");
    io:println("==============================================================");
    io:println("Insert Role Result: ", result);
    test:assertTrue(result.affectedRowCount > 0, msg = "Expected insert to affect at least one row");
}

// Test case for deleting a micro app (soft delete)
// Uncomment the following test after verifying ADD and UPDATE tests
// @test:Config
// function testDeleteMicroApp() returns error? {
//     string appId = "test-leave-app";
//     db:ExecutionSuccessResult result = check db:deleteMicroApp(appId, "delete-user@wso2.com");
//     io:println("==============================================================");
//     io:println("Delete Result: ", result);
//     test:assertTrue(result.affectedRowCount > 0, msg = "Expected delete to affect at least one row");
// }
