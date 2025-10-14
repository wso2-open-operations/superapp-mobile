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

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Narrow type for the mocked auth context
type MockAuth = {
  state: { isAuthenticated: boolean; username?: string; displayName?: string };
  signIn: jest.Mock;
  signOut: jest.Mock;
  getAccessToken: jest.Mock<Promise<string>>;
  getIDToken: jest.Mock<Promise<string>>;
  getDecodedIDToken: jest.Mock<any, any>;
  getBasicUserInfo: jest.Mock<any, any>;
};

// Mock Asgardeo auth context with a mutable object so each test can adjust it
let mockAuth: MockAuth;
jest.mock('@asgardeo/auth-react', () => ({
  useAuthContext: () => mockAuth,
}));

// No UI library mocks needed; components render semantic elements with data-testids

// MicroAppManagement relies on this to fetch apps
jest.mock('../../constants/api', () => {
  const real = jest.requireActual('../../constants/api');
  return {
    ...real,
    getEndpoint: jest.fn((k: string) => {
      const envMap: Record<string, string | undefined> = {
        MICROAPPS_LIST: process.env.REACT_APP_MICROAPPS_LIST_URL,
        MICROAPPS_UPLOAD: process.env.REACT_APP_MICROAPPS_UPLOAD_URL,
        USERS_BASE: process.env.REACT_APP_USERS_BASE_URL,
        USERS: process.env.REACT_APP_USERS_URL,
      };
      return (envMap[k] || real.getEndpoint(k)).replace(/\/$/, '');
    }),
  };
});

// Keep Button/Card/Loading simple to stabilize assertions
jest.mock('../../components/common/Button', () => {
  return function MockButton({ children, onClick, disabled, ...rest }: any) {
    return <button onClick={onClick} disabled={disabled} {...rest}>{children}</button>;
  };
});
jest.mock('../../components/common/Card', () => {
  return function MockCard({ children, ...rest }: any) {
    return <div data-testid="card" {...rest}>{children}</div>;
  };
});
jest.mock('../../components/common/Loading', () => {
  return function MockLoading({ message }: { message: string }) {
    return <div data-testid="loading">{message}</div>;
  };
});

// Stub UserProfile to avoid network/tokens in this integration test
jest.mock('../../components/UserProfile', () => () => <div>User Profile</div>);

// Import App AFTER mocks are set up
import App from '../../App';

// Global fetch mock
beforeEach(() => {
  mockAuth = {
    state: {
      isAuthenticated: false,
      username: '',
      displayName: '',
    },
    signIn: jest.fn(),
    signOut: jest.fn(),
    getAccessToken: jest.fn().mockResolvedValue('token-abc'),
    getIDToken: jest.fn().mockResolvedValue('id-123'),
    getDecodedIDToken: jest.fn(),
    getBasicUserInfo: jest.fn(),
  } as unknown as MockAuth;

  // @ts-ignore
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ([
      { micro_app_id: '1', name: 'Test App 1', version: '1.0.0', description: 'Desc 1' },
      { app_id: '2', name: 'Test App 2', version: '2.0.0', description: 'Desc 2' },
    ]),
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Admin Portal App integration', () => {
  test('Unauthenticated users see sign-in screen and can trigger signIn', async () => {
    mockAuth.state.isAuthenticated = false;

    render(<App />);

    expect(screen.getByText('Please Sign In')).toBeInTheDocument();
    const signInBtn = screen.getByRole('button', { name: /sign in/i });
    expect(signInBtn).toBeInTheDocument();

    fireEvent.click(signInBtn);
    expect(mockAuth.signIn).toHaveBeenCalled();
  });

  test('Authenticated users see greeting and micro-app list', async () => {
    mockAuth.state.isAuthenticated = true;
    mockAuth.state.username = 'alice@example.com';
    mockAuth.state.displayName = 'Alice Admin';

    render(<App />);

    // Greeting uses first name
    expect(await screen.findByText(/Hi Alice,/)).toBeInTheDocument();

    // Micro app management section loads and shows apps
    expect(await screen.findByText('Available Micro Apps')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Test App 1')).toBeInTheDocument();
      expect(screen.getByText('Test App 2')).toBeInTheDocument();
      expect(screen.getByText('v1.0.0')).toBeInTheDocument();
      expect(screen.getByText('v2.0.0')).toBeInTheDocument();
    });
  });

  test('Navigation: switch to User Profile and back from menu', async () => {
    mockAuth.state.isAuthenticated = true;
    mockAuth.state.username = 'bob@example.com';
    mockAuth.state.displayName = 'Bob Builder';

    render(<App />);

    // Ensure microapp page first
    expect(await screen.findByText('Available Micro Apps')).toBeInTheDocument();

    // Go to profile via sidebar menu
    const profileItem = screen.getByText('User Profile');
    fireEvent.click(profileItem);

    // UserProfile should be rendered in content area (not sidebar)
    const content = await screen.findByTestId('content');
    expect(content).toHaveTextContent('User Profile');
    // Micro app section should no longer be visible
    expect(screen.queryByText('Available Micro Apps')).not.toBeInTheDocument();

    // Go back to microapp
    const microappItem = screen.getByText('Micro App Management');
    fireEvent.click(microappItem);
    expect(await screen.findByText('Available Micro Apps')).toBeInTheDocument();
  });

  test('Clicking Logout triggers signOut', async () => {
    mockAuth.state.isAuthenticated = true;
    mockAuth.state.username = 'carol@example.com';
    mockAuth.state.displayName = 'Carol Admin';

    render(<App />);

    // Wait for layout
    await screen.findByText('Available Micro Apps');

    const logoutItem = screen.getByText('Logout');
    fireEvent.click(logoutItem);

    expect(mockAuth.signOut).toHaveBeenCalledTimes(1);
  });
});
