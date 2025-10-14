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

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@asgardeo/auth-react';
import { Alert, Button, Card, CardContent, Typography, Stack } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import LoginIcon from '@mui/icons-material/Login';

type AuthContextLike = {
  state?: {
    isAuthenticated?: boolean;
    accessToken?: string | null;
    accessTokenPayload?: any;
  };
  getAccessToken?: () => Promise<string | null | undefined>;
  getIDToken?: () => Promise<string | null | undefined>;
  getDecodedIDToken?: () => any;
  getBasicUserInfo?: () => Promise<any>;
  signOut?: () => void | Promise<void>;
};

type RoleBasedAccessControlProps = {
  children?: React.ReactNode;
  requiredGroups?: string[];
};

const Title: React.FC<React.ComponentProps<typeof Typography>> = ({ children, ...props }) => (
  <Typography variant="h4" gutterBottom {...props}>{children}</Typography>
);
const Paragraph: React.FC<React.ComponentProps<typeof Typography>> = ({ children, ...props }) => (
  <Typography variant="body1" {...props}>{children}</Typography>
);

const RoleBasedAccessControl: React.FC<RoleBasedAccessControlProps> = ({
  children,
  requiredGroups = ['superapp_admin'],
}) => {
  const auth = useAuthContext() as unknown as AuthContextLike;

  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [userGroups, setUserGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const extractUserGroups = async (): Promise<string[]> => {

    try {
      const accessToken = await auth?.getAccessToken?.();
      if (accessToken) {
        try {
          const tokenParts = accessToken.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            const groups = payload.groups ||
              payload['http://wso2.org/claims/role'] ||
              payload.roles ||
              [];
            if (groups && (Array.isArray(groups) ? groups.length > 0 : true)) {
              return Array.isArray(groups) ? groups : [groups].filter(Boolean);
            }
          }
        } catch (decodeError) {
          console.warn('Could not decode access token:', decodeError);
        }
      }
      const idToken = await auth?.getIDToken?.();
      if (idToken) {
        const decodedIdToken = auth?.getDecodedIDToken?.();
        if (decodedIdToken) {
          const groups = decodedIdToken.groups ||
            decodedIdToken['http://wso2.org/claims/role'] ||
            decodedIdToken.roles ||
            [];
          if (groups && (Array.isArray(groups) ? groups.length > 0 : true)) {
            return Array.isArray(groups) ? groups : [groups].filter(Boolean);
          }
        }
      }

      try {
        const basicUserInfo = await auth?.getBasicUserInfo?.();
        if (basicUserInfo) {
          const groups = basicUserInfo.groups ||
            basicUserInfo['http://wso2.org/claims/role'] ||
            basicUserInfo.roles ||
            basicUserInfo.role ||
            basicUserInfo['wso2_role'] ||
            [];
          if (groups && (Array.isArray(groups) ? groups.length > 0 : true)) {
            return Array.isArray(groups) ? groups : [groups].filter(Boolean);
          }
        }
      } catch (userInfoError) {
        console.warn('Could not fetch user info:', userInfoError);
      }

      try {
        const accessTokenPayload = auth?.state?.accessTokenPayload as any;
        const groups = accessTokenPayload?.groups ||
          accessTokenPayload?.roles ||
          accessTokenPayload?.['http://wso2.org/claims/role'] ||
          [];

        if (groups) {
          return Array.isArray(groups) ? groups : [groups].filter(Boolean);
        }
      } catch (accessTokenError) {
        console.warn('Could not access token payload:', accessTokenError);
      }
      // return [];
      return [];
    } catch (error) {
      console.error('Error extracting user groups:', error);
      throw error;
    }
  };

  const hasRequiredAccess = (userGroups: string[], requiredGroupsList: string[]): boolean => {
    return requiredGroupsList.some((requiredGroup) =>
      userGroups.some((userGroup) => userGroup.toLowerCase().includes(requiredGroup.toLowerCase()))
    );
  };

  useEffect(() => {
    const checkAuthorization = async () => {
      if (!auth?.state?.isAuthenticated) {
        setIsAuthorized(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const groups = await extractUserGroups();
        setUserGroups(groups);

        const authorized = hasRequiredAccess(groups, requiredGroups);
        setIsAuthorized(authorized);
      } catch (error) {
        setIsAuthorized(false);
        setError('Authorization check failed');
      } finally {
        setLoading(false);
      }
    };

    checkAuthorization();
  }, [auth?.state?.isAuthenticated, JSON.stringify(requiredGroups)]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <Card sx={{ textAlign: 'center', maxWidth: 400 }}>
          <CardContent>
            <Paragraph style={{ marginTop: 16 }}>
              Verifying access permissions...
            </Paragraph>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px'
      }}>
        <Card sx={{ maxWidth: 600, textAlign: 'center', p: 2 }}>
          <ErrorOutlineIcon sx={{ fontSize: 48, color: '#ff4d4f', mb: 2 }} />
          <Title sx={{ color: '#ff4d4f' }}>Access Denied</Title>
          <Alert severity="error" sx={{ mb: 2, textAlign: 'left' }}>
            Unauthorized Access: You are not authorized to access this application. Please contact your administrator if you believe this is an error.
          </Alert>
          <Paragraph>
            <strong>Required Access:</strong> You need to be a member of one of the following groups:
          </Paragraph>

          <ul style={{ textAlign: 'left', marginBottom: '24px' }}>
            {requiredGroups.map((group) => (
              <li key={group}><code>{group}</code></li>
            ))}
          </ul>

          {userGroups.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <Paragraph>
                <strong>Your current groups:</strong>
              </Paragraph>
              <ul style={{ textAlign: 'left' }}>
                {userGroups.map((group) => (
                  <li key={group}><code>{group}</code></li>
                ))}
              </ul>
            </div>
          )}

          {error && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="contained" startIcon={<LoginIcon />} onClick={() => auth?.signOut?.()}>
              Sign Out
            </Button>
            <Button variant="outlined" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </Stack>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default RoleBasedAccessControl;
