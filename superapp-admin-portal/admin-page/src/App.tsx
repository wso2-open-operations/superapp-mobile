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
 * Admin Portal Main Application Component (TypeScript)
 */

import React, { useEffect, useState } from 'react';
import { useAuthContext } from '@asgardeo/auth-react';
import { Box, Container } from '@mui/material';
import UserProfile from './components/UserProfile';
import MicroAppManagement from './components/MicroAppManagement';
import MenuBar from './components/MenuBar';
import { COMMON_STYLES, COLORS } from './constants/styles';

// Minimal shape for Asgardeo's state object we use
interface AuthState {
  isAuthenticated?: boolean;
  username?: string;
  displayName?: string;
  given_name?: string;
}

export default function App(): React.ReactElement {
  // Extract authentication context and methods from Asgardeo provider
  const ctx = useAuthContext() as any;
  const state: AuthState | undefined = ctx?.state;
  const signIn: (() => Promise<void>) | undefined = ctx?.signIn;
  const signOut: (() => Promise<void>) | undefined = ctx?.signOut;

  // Authentication state derived from Asgardeo context
  const isAuthed = Boolean(state?.isAuthenticated);

  // Extract user information from authentication state with fallbacks
  const username = state?.username || '';
  const emailLocalPart = username.includes('@') ? username.split('@')[0] : '';
  const firstName = (state?.displayName || emailLocalPart || state?.given_name || username || '').split(' ')[0];

  // Navigation state for switching between admin sections
  const [activeKey, setActiveKey] = useState<'microapp' | 'profile'>('microapp');

  useEffect(() => {
    if (isAuthed) {
      (async () => {
        try {
          const token = await ctx?.getAccessToken?.();
          // You can use the token here if needed
        } catch (error) {
          console.error('Failed to get access token:', error);
        }
      })();
    }
  }, [isAuthed, username, ctx]);

  // Navigation handler for switching between admin sections
  const onNavigate = (key: 'microapp' | 'profile') => setActiveKey(key);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }} data-testid="layout">
      {isAuthed ? (
        <>
          <MenuBar
            onNavigate={(k) => onNavigate(k as 'microapp' | 'profile')}
            isAuthed={isAuthed}
            onSignOut={() => void signOut?.()}
            activeKey={activeKey}
            placement="left"
          />
          <Box sx={{ ml: '200px' , mt:'-680px'}}>
            <Box component="main" sx={{ flexGrow: 1 }}></Box>
            <Container data-testid="content" sx={{ p: 0 }}>
              <div className="greeting" style={COMMON_STYLES.greeting}>
                Hi {firstName},
              </div>
              <main style={{ paddingBottom: 24 }}>
                {activeKey === 'microapp' && (
                  <section style={{ ...COMMON_STYLES.section, marginTop: 0 }}>
                    <MicroAppManagement />
                  </section>
                )}
                {activeKey === 'profile' && (
                  <section className="card">
                    <UserProfile state={state as any} />
                  </section>
                )}
              </main>
            </Container>
          </Box>
        </>
      ) : (
        <Box data-testid="content" sx={{ p: 0, minHeight: '100vh' }}>
          <div
            style={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '32px 16px',
              background: `linear-gradient(135deg, ${COLORS.background} 0%, #e6f4ff 60%, #d9edff 100%)`,
            }}
          >
            <section
              className="card"
              style={{
                textAlign: 'center',
                background: '#e6f4ff',
                border: `1px solid ${COLORS.border}`,
                color: COLORS.primary,
                maxWidth: 420,
                width: '100%',
                boxShadow: '0 6px 24px -4px rgba(0,58,103,0.15)',
              }}
            >
              <h2 style={{ marginTop: 0, color: COLORS.primary }}>Please Sign In</h2>
              <p style={{ color: COLORS.secondary, marginTop: 0 }}>
                You must be logged in to use the admin portal.
              </p>
              <button
                className="btn btn--primary"
                style={COMMON_STYLES.button}
                onClick={() => void signIn?.()}
                onFocus={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = COMMON_STYLES.buttonFocus.boxShadow as string;
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                }}
              >
                Sign In
              </button>
            </section>
          </div>
        </Box>
      )}
    </Box>
  );
}
