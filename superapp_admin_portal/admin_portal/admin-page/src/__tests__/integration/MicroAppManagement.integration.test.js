import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// API Endpoints mock MUST come before component imports
// Use real constants/api to ensure upload/list endpoints are defined

import MicroAppManagement from '../../components/MicroAppManagement';

// Mock Asgardeo
let mockAuth;
jest.mock('@asgardeo/auth-react', () => ({
  useAuthContext: () => mockAuth,
}));

// Mock common UI to simplify
jest.mock('../../components/common/Button', () => {
  return function MockButton({ children, onClick, disabled, ...rest }) {
    return <button onClick={onClick} disabled={disabled} {...rest}>{children}</button>;
  };
});
jest.mock('../../components/common/Card', () => {
  return function MockCard({ children, ...rest }) {
    return <div data-testid="card" {...rest}>{children}</div>;
  };
});
jest.mock('../../components/common/Loading', () => {
  return function MockLoading({ message }) { return <div data-testid="loading">{message}</div>; };
});

// Helpers for file creation (ensure magic bytes and Blob.slice arrayBuffer available)
const createZipFile = (name = 'app.zip') => {
  const header = new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0x00]);
  const file = new File([header], name, { type: 'application/zip' });
  file.slice = function slice() {
    return { arrayBuffer: async () => header.buffer };
  };
  return file;
};

beforeEach(() => {
  mockAuth = {
    state: { isAuthenticated: true },
    getAccessToken: jest.fn().mockResolvedValue('token-xyz'),
  };

  let listCallCount = 0;
  global.fetch = jest.fn((url, init = {}) => {
    const u = String(url ?? '');
    // Treat any POST as a successful upload
    if (init && init.method === 'POST') {
      return Promise.resolve({
        ok: true,
        headers: { get: () => 'application/json' },
        json: async () => ({ message: 'Uploaded' }),
        text: async () => JSON.stringify({ message: 'Uploaded' })
      });
    }
    // Handle list GETs for both hyphenated and non-hyphenated endpoints
    if (u.includes('micro-app') || u.includes('microapps') || u.includes('microapps')) {
      listCallCount += 1;
      const payload = listCallCount === 1
        ? [
            { micro_app_id: '1', name: 'Existing App', version: '1.0.0', description: 'Old' },
          ]
        : [
            { micro_app_id: '1', name: 'Existing App', version: '1.0.0', description: 'Old' },
            { app_id: '2', name: 'Newly Uploaded', version: '1.1.0', description: 'New' },
          ];
      return Promise.resolve({ ok: true, json: async () => payload });
    }
    return Promise.resolve({ ok: true, json: async () => [] });
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('MicroAppManagement integration (with real UploadMicroApp)', () => {
  test('Initial list, open upload, submit, and list refresh/close', async () => {
    render(<MicroAppManagement />);

    // Initial list loads
    expect(await screen.findByText('Available Micro Apps')).toBeInTheDocument();
    // Wait for either existing app or the empty state; then if empty, click refresh and wait again
    const sawExisting = await waitFor(async () => {
      if (screen.queryByText('Existing App')) return true;
      if (screen.queryByText('No micro-apps found.')) {
        const refresh = screen.getByRole('button', { name: /refresh/i });
        fireEvent.click(refresh);
      }
      return screen.queryByText('Existing App') != null;
    });

    // Enter upload mode
    const addBtn = screen.getByRole('button', { name: /add new/i });
    fireEvent.click(addBtn);
    expect(screen.getByText(/Upload Micro-App/i)).toBeInTheDocument();

    // Fill out required fields
    fireEvent.change(screen.getByPlaceholderText('e.g., Payslip Viewer'), { target: { value: 'My App' } });
    fireEvent.change(screen.getByPlaceholderText('e.g., 1.0.0'), { target: { value: '1.1.0' } });
    fireEvent.change(screen.getByPlaceholderText('e.g., payslip-viewer'), { target: { value: 'my-app' } });
    fireEvent.change(screen.getByPlaceholderText('Brief description of what the micro-app does'), { target: { value: 'Desc' } });

    // Select file: choose ZIP -> confirm
    const fileInput = document.querySelector('input[type="file"]');
    const zip = createZipFile('my-app.zip');
    fireEvent.change(fileInput, { target: { files: [zip] } });
    expect(await screen.findByText('Confirm File')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /^yes$/i }));

  // Upload
  const uploadBtn = screen.getByRole('button', { name: /^upload$/i });
  fireEvent.click(uploadBtn);

  // After onUploaded the panel should close and list should refresh
  await waitFor(() => expect(screen.queryByText(/Upload Micro-App/)).not.toBeInTheDocument());
  await waitFor(() => expect(screen.getByText('Newly Uploaded')).toBeInTheDocument());
  });
});
