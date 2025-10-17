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

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuthContext } from '@asgardeo/auth-react';
import { extractGroupsFromClaims } from '../utils/authorization';
import type { JWTPayload, AuthContextLike } from "../types/authentication"

export type AuthInfo = {
  isAuthenticated: boolean;
  groups: string[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  // Expose the raw auth context only if consumers need signOut, etc.
  auth: AuthContextLike;
};

// Utility function to decode base64url strings (used in JWTs)
function base64UrlDecode(input: string): string {
  // Replace non-url compatible chars with base64 standard chars
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/");
  // Pad with '=' to make length a multiple of 4
  const padded = b64.padEnd(b64.length + ((4 - (b64.length % 4)) % 4), "=");
  // Decode base64 string
  return atob(padded);
}

function decodeJwtPayload(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    // Use the utility function to decode the payload
    const json = base64UrlDecode(parts[1]);
    const payload: JWTPayload = JSON.parse(json);
    return payload;
  } catch (err) {
    // Keep token details out of logs; just note the failure.
    console.error("useAuthInfo.decodeJwtPayload: Failed to decode JWT payload", err);
    return null;
  }
}

export function useAuthInfo(): AuthInfo {
  const auth = useAuthContext() as AuthContextLike;
  const isAuthenticated = !!auth?.state?.isAuthenticated;

  const [groups, setGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const extractUserGroups = useCallback(async (): Promise<string[]> => {
    // 1) Try access token (decode JWT)
    try {
      const accessToken = await auth?.getAccessToken?.();
      if (accessToken) {
        const payload = decodeJwtPayload(accessToken);
        if (payload) {
          const fromAccess = extractGroupsFromClaims(payload);
          if (fromAccess.length > 0) return fromAccess;
        }
      }
    } catch (err) {
      console.error("useAuthInfo.extractUserGroups: Access token processing failed", err);
    }

    // 2) Try ID token (decoded claims)
    try {
      const idToken = await auth?.getIDToken?.();
      if (idToken) {
        const decoded = auth?.getDecodedIDToken?.();
        if (decoded) {
          const fromId = extractGroupsFromClaims(decoded);
          if (fromId.length > 0) return fromId;
        }
      }
    } catch (err) {
      console.error("useAuthInfo.extractUserGroups: ID token processing failed", err);
    }

    // 3) Try basic user info endpoint
    try {
      const basic = await auth?.getBasicUserInfo?.();
      if (basic) {
        const fromUserInfo = extractGroupsFromClaims(basic);
        if (fromUserInfo.length > 0) return fromUserInfo;
      }
    } catch (err) {
      console.error("useAuthInfo.extractUserGroups: Basic user info processing failed", err);
    }

    // 4) Try access token payload from state
    try {
      const payload = auth?.state?.accessTokenPayload;
      const fromState = extractGroupsFromClaims(payload);
      if (fromState.length > 0) return fromState;
    } catch (err) {
      console.error(
        "useAuthInfo.extractUserGroups: Access token payload from state processing failed",
        err,
      );
    }

    // Nothing found
    return [];
  }, [auth]);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setGroups([]);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const g = await extractUserGroups();
      setGroups(g);
    } catch (e) {
      setError('Failed to load user groups');
      setGroups([]);
    } finally {
      setLoading(false);
    }
  }, [extractUserGroups, isAuthenticated]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!isAuthenticated) {
        setGroups([]);
        setLoading(false);
        setError(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const g = await extractUserGroups();
        if (!cancelled) setGroups(g);
      } catch (e) {
        if (!cancelled) setError('Failed to load user groups');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, extractUserGroups]);

  return useMemo(
    () => ({ isAuthenticated, groups, loading, error, refresh, auth }),
    [isAuthenticated, groups, loading, error, refresh, auth]
  );
}

export default useAuthInfo;
