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

import { createProxyMiddleware } from 'http-proxy-middleware';

// Minimal app type to avoid depending on express types
type AppLike = {
  use: (...args: any[]) => void;
};

/**
 * Dev server proxy to bypass browser CORS when calling remote endpoints.
 * Note: CRA only loads `setupProxy.js` at runtime. This TS file is for type-safety
 * and documentation. Keep the JS file alongside to remain effective.
 */
export default function setupProxy(app: AppLike): void {
  // ===================== Payslip upload proxy =====================
  // Derive origin+path from env when available; fall back to previous defaults.
  const payslipUploadUrlFromEnv =
    process.env.DEV_PROXY_PAYSLIP_UPLOAD_URL ||
    process.env.REACT_APP_PAYSLIP_UPLOAD_URL ||
    '';

  // Base host-or-origin for payslip uploads; used when only base is provided.
  let payslipTargetOrigin =
    process.env.DEV_PROXY_PAYSLIP_TARGET_ORIGIN ||
    (() => {
      try {
        if (payslipUploadUrlFromEnv) return new URL(payslipUploadUrlFromEnv).origin;
      } catch {}
      return 'https://41200aa1-4106-4e6c-babf-311dce37c04a-prod.e1-us-east-azure.choreoapps.dev';
    })();

  // Normalize common mistakes (e.g., 'http:localhost:9090' or missing protocol)
  let target = payslipTargetOrigin;
  // Normalize common mistakes (e.g., 'http:localhost:9090' or missing protocol)
  if (/^https?:localhost:\d+/.test(target)) {
    target = target.replace(/^(https?):/, '$1://');
  }
  if (!/^https?:\/\//.test(target)) {
    target = 'http://' + target; // fallback assumption
  }


  // Final full URL = {target}{upstreamUploadPath}
  const upstreamUploadPath =
    process.env.DEV_PROXY_PAYSLIP_UPLOAD_PATH ||
    (() => {
      try {
        if (payslipUploadUrlFromEnv) return new URL(payslipUploadUrlFromEnv).pathname;
      } catch {}
      return '/gov-superapp/microappbackendprodbranch/v1.0/admin-portal/upload';
    })();

  app.use(['/upload', '/api/payslips/upload'], createProxyMiddleware({
    target,
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: (path: string) => {
      if (path === '/upload' || path === '/api/payslips/upload') {
        return upstreamUploadPath;
      }
      return path;
    },
    onError: (err: Error, res: any) => {
      // eslint-disable-next-line no-console
      console.error('[setupProxy] Proxy error:', err.message);
      if (!res.headersSent) {
        res.writeHead(502, { 'Content-Type': 'application/json' });
      }
      res.end(JSON.stringify({ error: 'Bad gateway', detail: err.message }));
    },
  }));

  // ---------------------------------------------------------------------------
  // Micro-app upload proxy (avoids browser CORS when calling remote gateway)
  const apiBase = process.env.REACT_APP_API_BASE_URL;
  const microAppsTarget =
    process.env.DEV_PROXY_MICROAPPS_TARGET_ORIGIN ||
    (() => {
      try {
        if (apiBase) return new URL(apiBase).origin;
      } catch {}
      return 'https://41200aa1-4106-4e6c-babf-311dce37c04a-prod.e1-us-east-azure.choreoapis.dev';
    })();

  const microAppsBasePath =
    process.env.DEV_PROXY_MICROAPPS_BASE_PATH ||
    (() => {
      try {
        if (apiBase) return new URL(apiBase).pathname.replace(/\/$/, '');
      } catch {}
      return '/gov-superapp/superappbackendprodbranch/v1.0';
    })();

  const microAppsUploadPath =
    process.env.DEV_PROXY_MICROAPPS_UPLOAD_PATH || '/micro-apps/upload';


  app.use('/api/microapps', createProxyMiddleware({
    target: microAppsTarget,
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: (path: string) => {
      if (path === '/api/microapps/upload') {
        const rewritten = microAppsBasePath + microAppsUploadPath;
        return rewritten;
      }
      return path;
    },
    onProxyReq: (proxyReq: any) => {
      const shouldStrip = process.env.MICROAPPS_STRIP_ASSERTION === 'true';
      const assertion = proxyReq.getHeader?.('x-jwt-assertion');
      if (shouldStrip && assertion) {
        proxyReq.removeHeader?.('x-jwt-assertion');
      }
    },
    onError: (err: Error, req: any, res: any) => {
      if (!res.headersSent) {
        res.writeHead(502, { 'Content-Type': 'application/json' });
      }
      res.end(JSON.stringify({ error: 'Bad gateway (microapps)', detail: err.message }));
    },
  }));
}
