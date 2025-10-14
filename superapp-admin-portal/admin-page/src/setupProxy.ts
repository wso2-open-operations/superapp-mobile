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
  // Upstream host (no path). Keep existing env override behavior.
  // Set target from environment variable, fallback to empty string if not set
  let target = process.env.PROXY_TARGET || '';
  // Normalize common mistakes (e.g., 'http:localhost:9090' or missing protocol)
  if (/^https?:localhost:\d+/.test(target)) {
    target = target.replace(/^(https?):/, '$1://');
  }
  if (target && !/^https?:\/\//.test(target)) {
    target = 'http://' + target; // fallback assumption
  }


  // Final full URL = {target}/gov-superapp/microappbackendprodbranch/v1.0/admin-portal/upload
  const upstreamUploadPath = '/gov-superapp/microappbackendprodbranch/v1.0/admin-portal/upload';

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
    onProxyReq: (proxyReq: any, req: any) => {
      const host = proxyReq.getHeader?.('host');
    },
    onError: (err: Error, req: any, res: any) => {
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
  // Micro-app proxy configuration. Set these environment variables as needed:
  //   MICRO_APPS_TARGET: upstream host (e.g., 'http://localhost:9000')
  //   MICRO_APPS_BASE_PATH: base path for micro-apps (e.g., '/gov-superapp/microappbackendprodbranch/v1.0/admin-portal')
  //   MICRO_APPS_UPLOAD_PATH: upload endpoint path (e.g., '/upload')
  const microAppsTarget = process.env.MICRO_APPS_TARGET || '';
  const microAppsBasePath = process.env.MICRO_APPS_BASE_PATH || '';
  const microAppsUploadPath = process.env.MICRO_APPS_UPLOAD_PATH || '/upload';

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
