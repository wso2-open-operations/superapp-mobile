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
 * Main entry point for the Admin Portal React application (TypeScript)
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from '@asgardeo/auth-react';

const rootEl = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootEl);

root.render(
  <React.StrictMode>
    <AuthProvider
      config={{
        // Production URLs (currently active for deployment)
        //signInRedirectURL: 'https://a96477cc-362b-4509-95ad-fcdb6507c34a.e1-us-east-azure.choreoapps.dev',
        //signOutRedirectURL: 'https://a96477cc-362b-4509-95ad-fcdb6507c34a.e1-us-east-azure.choreoapps.dev',
        // Local development URLs (commented out - uncomment for local dev)
        signInRedirectURL: 'http://localhost:3000',
        signOutRedirectURL: 'http://localhost:3000',
        clientID: 'aVro3ATf5ZSglZHItEDj0Kd7M4wa',
        baseUrl: 'https://api.asgardeo.io/t/lsfproject',
        scope: ['openid', 'profile', 'groups'],
      }}
    >
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// Performance Monitoring Setup
reportWebVitals();
