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
 * Role-Based Access Control Component (TypeScript)
 */
import React, { useEffect, useMemo, useState } from "react";
import { useAuthContext } from '@asgardeo/auth-react';
import type { AuthContextLike } from '../types/authentication';
import useAuthInfo from '../hooks/useAuthInfo';
import { Card, CardContent, Typography } from '@mui/material';
import AccessDenied from './common/AccessDenied';

type RoleBasedAccessControlProps = {
  children?: React.ReactNode;
  requiredGroups?: string[];
};

const Paragraph: React.FC<React.ComponentProps<typeof Typography>> = ({ children, ...props }) => (
  <Typography variant="body1" {...props}>{children}</Typography>
);

const RoleBasedAccessControl: React.FC<RoleBasedAccessControlProps> = ({
  children,
  requiredGroups = ['superapp_admin'],
}) => {
  const auth = useAuthContext() as AuthContextLike;
  const { isAuthenticated, groups: userGroups, loading, error, refresh } = useAuthInfo();

  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  // Create a stable key for requiredGroups to avoid JSON.stringify in deps.
  // Sort and lowercase so order/case changes don't retrigger unnecessarily.
  const requiredGroupsKey = useMemo(() => {
    return [...requiredGroups].map((g) => g.toLowerCase()).sort().join("|");
  }, [requiredGroups]);

  const hasRequiredAccess = (userGroups: string[], requiredGroupsList: string[]): boolean => {
    return requiredGroupsList.some((requiredGroup) =>
      userGroups.some((userGroup) => userGroup.toLowerCase().includes(requiredGroup.toLowerCase()))
    );
  };

  useEffect(() => {
    const required = requiredGroupsKey.split("|").filter(Boolean);
    const authorized = isAuthenticated && hasRequiredAccess(userGroups, required);
    setIsAuthorized(authorized);
  }, [isAuthenticated, userGroups, requiredGroupsKey]);

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
      <AccessDenied
        requiredGroups={requiredGroups}
        userGroups={userGroups}
        error={error}
        onSignOut={async () => {
          try {
            // Execute signOut if available; ignore any return value for compatibility
            await auth?.signOut?.();
          } catch {
            console.error("Sign-out failed");
          }
        }}
        onRetry={() => refresh()}
      />
    );
  }

  return <>{children}</>;
};

export default RoleBasedAccessControl;
