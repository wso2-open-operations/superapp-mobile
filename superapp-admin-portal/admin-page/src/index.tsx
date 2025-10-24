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

/**
 * Main entry point for the Admin Portal
 */

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "@asgardeo/auth-react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createAppTheme } from "./theme";

const rootEl = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(rootEl);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={createAppTheme("light")}>
      <CssBaseline />
      <AuthProvider
        config={{
          // Use environment variables for configuration
          signInRedirectURL:
            process.env.REACT_APP_SIGN_IN_REDIRECT_URL ||
            window.location.origin,
          signOutRedirectURL:
            process.env.REACT_APP_SIGN_OUT_REDIRECT_URL ||
            window.location.origin,
          clientID: process.env.REACT_APP_CLIENT_ID || "",
          baseUrl: process.env.REACT_APP_BASE_URL || "",
          scope: process.env.REACT_APP_SCOPE
            ? process.env.REACT_APP_SCOPE.split(",")
            : ["openid"],
        }}
      >
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);

// Performance Monitoring Setup
reportWebVitals();
