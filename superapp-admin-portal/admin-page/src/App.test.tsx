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

import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

type MockAuth = {
  state: { isAuthenticated: boolean; username?: string; displayName?: string };
  signIn: jest.Mock<any, any>;
  signOut: jest.Mock<any, any>;
  getAccessToken: jest.Mock<any, any>;
};

let mockAuth: MockAuth;
jest.mock("@asgardeo/auth-react", () => ({
  useAuthContext: () => mockAuth,
}));

jest.mock("./constants/api", () => {
  const real = jest.requireActual("./constants/api");
  return {
    ...real,
    getEndpoint: jest.fn((k: string) => {
      // In tests, prefer env overrides when set; else fall back to defaults
      const envMap: Record<string, string | undefined> = {
        MICROAPPS_LIST: process.env.REACT_APP_MICROAPPS_LIST_URL,
        MICROAPPS_UPLOAD: process.env.REACT_APP_MICROAPPS_UPLOAD_URL,
        USERS_BASE: process.env.REACT_APP_USERS_BASE_URL,
        USERS: process.env.REACT_APP_USERS_URL,
      };
      return (envMap[k] || real.getEndpoint(k)).replace(/\/$/, "");
    }),
  };
});

beforeEach(() => {
  mockAuth = {
    state: { isAuthenticated: false, username: "", displayName: "" },
    signIn: jest.fn(),
    signOut: jest.fn(),
    getAccessToken: jest.fn(),
  };
  // @ts-ignore
  global.fetch = jest
    .fn()
    .mockResolvedValue({ ok: true, json: async () => [] });
});

afterEach(() => jest.clearAllMocks());

test("renders sign in screen when not authenticated", () => {
  mockAuth.state.isAuthenticated = false;
  render(<App />);
  expect(screen.getByText(/Please Sign In/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
  expect(mockAuth.signIn).toHaveBeenCalled();
});

test("renders menu when authenticated", async () => {
  mockAuth.state.isAuthenticated = true;
  mockAuth.state.displayName = "Zoe Zebra";
  render(<App />);
  expect(await screen.findByText(/Hi Zoe,/)).toBeInTheDocument();
});
