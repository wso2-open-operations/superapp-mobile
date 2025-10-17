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
 * MicroAppManagement Component (TypeScript)
 */
import React, { useEffect, useState, useCallback } from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import UploadMicroApp from "./UploadMicroApp";
import Button from "./common/Button";
import Loading from "./common/Loading";
import Card from "./common/Card";
import { COLORS, COMMON_STYLES } from "../constants/styles";
import { getEndpoint } from "../constants/api";
import { API_KEYS, ApiKey } from "../constants/apiKeys";


type MicroApp = {
  micro_app_id?: string;
  app_id?: string;
  name?: string;
  version?: string;
  description?: string;
};

type AuthContextLike = {
  state?: { isAuthenticated?: boolean };
  getAccessToken?: () => Promise<string>;
};

// Common container keys likely used by various backends for array payloads
enum ContainerKey {
  Items = 'items',
  Data = 'data',
  Content = 'content',
  Results = 'results',
  Records = 'records',
  List = 'list',
  MicroApps = 'microApps',
  Microapps = 'microapps',
}

// UploadMicroApp is now fully typed in TypeScript

export default function MicroAppManagement(): React.ReactElement {
  // Authentication context for secure API calls
  const auth = useAuthContext() as AuthContextLike;

  // Component state management
  const [showUpload, setShowUpload] = useState(false);
  const [microApps, setMicroApps] = useState<MicroApp[]>([]);
  const [loadingList, setLoadingList] = useState<boolean>(false);
  const [listError, setListError] = useState<string>("");

  const fetchMicroApps = useCallback(async () => {
    setLoadingList(true);
    setListError("");

    try {
      const headers: Record<string, string> = { Accept: "application/json" };
      if (auth?.state?.isAuthenticated) {
        // Use access token for both Authorization and x-jwt-assertion (invoker).
        try {
          const access = await auth.getAccessToken?.().catch(() => undefined);

          if (access) {
            headers["Authorization"] = `Bearer ${access}`;
          }
        } catch (e) {
          const err = e instanceof Error ? e : new Error(String(e));
          console.warn("Authentication token acquisition failed:", err);
        }
      }

      const endpoint = getEndpoint(API_KEYS.MICROAPPS_LIST);
      const res = await fetch(endpoint, { headers });

      if (!res.ok) {
        throw new Error(`Failed to load micro-apps (${res.status})`);
      }

      // Attempt robust JSON parsing and normalization
      let data: unknown = null;
      try {
        data = await res.json();
      } catch (err) {
        console.error('[MicroAppManagement] Non-JSON response from endpoint', { endpoint });
        throw new Error('Unexpected response format (non-JSON)');
      }

      const normalize = (d: unknown): MicroApp[] => {
        if (Array.isArray(d)) return d as MicroApp[];
        if (!d || typeof d !== 'object') return [];

        const obj = d as Record<string, unknown>;
        // Common container keys
        // Check common container keys
        const candidates = Object.values(ContainerKey) as string[];
        for (const key of candidates) {
          const v = obj[key];
          if (Array.isArray(v)) return v as MicroApp[];
          if (v && typeof v === 'object') {
            const nested = v as Record<string, unknown>;
            // Nested container like { data: { items: [...] } }
            for (const k2 of candidates) {
              const v2 = nested[k2];
              if (Array.isArray(v2)) return v2 as MicroApp[];
            }
          }
        }
        return [];
      };

      const normalized = normalize(data);
      setMicroApps(normalized);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Error loading apps";
      setListError(errorMessage);
    } finally {
      setLoadingList(false);
    }
  }, [auth]);

  useEffect(() => {
    fetchMicroApps();
  }, [fetchMicroApps]);

  return (
    <div style={{ color: COLORS.primary, lineHeight: 1.15 }}>
      {!showUpload && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <h2 style={{ margin: 0, color: COLORS.primary }}>Available Micro Apps</h2>
          <div style={{ display: "flex", gap: 0, marginTop: 0 }}>
            <Button onClick={fetchMicroApps} disabled={loadingList}>
              {loadingList ? "Refreshing…" : "Refresh"}
            </Button>

            <Button onClick={() => setShowUpload((s) => !s)}>
              {showUpload ? "Close Upload" : "Add new"}
            </Button>
          </div>
        </div>
      )}

      {showUpload && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
          <Button onClick={() => setShowUpload(false)}>Close</Button>
        </div>
      )}

      {listError && !showUpload && (
        <Card
          style={{
            ...(COMMON_STYLES?.alertError || {
              background: COLORS.errorSurfaceBackground || '#2d1f1f',
              border: `1px solid ${COLORS.errorSurfaceBorder || '#5a2f2f'}`,
              color: COLORS.errorSurfaceText || '#fca5a5',
              borderRadius: 12,
            }),
            padding: 12,
            marginBottom: 16,
          }}
        >
          {listError}
        </Card>
      )}

  {showUpload && (
        <Card style={{ padding: 16, marginBottom: 20 }}>
          <UploadMicroApp
            onUploaded={() => {
              fetchMicroApps();
              setShowUpload(false);
            }}
          />
        </Card>
      )}

      {!showUpload && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 12,
          }}
        >
          {loadingList && microApps.length === 0 && (
            <Loading message="Loading micro-apps…" />
          )}

          {!loadingList && microApps.length === 0 && !listError && (
            <Card style={{ padding: 16, background: COLORS.inverted, color: COLORS.invertedText }}>
              No micro-apps found.
            </Card>
          )}

          {microApps.map((app) => (
        <Card
              key={app.micro_app_id || app.app_id || Math.random().toString(36)}
              style={{
                padding: 16,
                background: COLORS.cardBackground,
                border: `1px solid ${COLORS.borderAlt || COLORS.border}`,
                cursor: 'default',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                borderRadius: 14,
                boxShadow: '0 3px 8px -2px rgba(0,58,103,0.15)'
              }}
            >
              <div style={{ display: 'flex', gap: 12 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    background: COLORS.borderAlt,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    borderRadius: 8,
                    color: COLORS.accent,
                  }}
                >
                  {(app.name ? app.name : '?').slice(0, 2).toUpperCase()}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: COLORS.text }}>
                    {(() => {
                      if (typeof app.name === 'string' && app.name.length > 1) {
                        return app.name;
                      }
                      if (!app.name) {
                        return app.micro_app_id || app.app_id || '';
                      }
                      return app.micro_app_id || app.app_id || app.name;
                    })()}
                  </div>
                  <div style={{ color: COLORS.textMuted, fontSize: 12 }}>
                    v{app.version || '—'}
                  </div>
                </div>
              </div>

              <div style={{ color: COLORS.textSubtle || '#595959', fontSize: 12, flexGrow: 1 }}>
                {app.description || 'No description'}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
