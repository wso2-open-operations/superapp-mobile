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

import { createProxyMiddleware } from "http-proxy-middleware";

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
  // Resolve proxy log level from env with validation
  const allowedLogLevels = [
    "debug",
    "info",
    "warn",
    "error",
    "silent",
  ] as const;
  type LogLevel = (typeof allowedLogLevels)[number];
  const normalizeLogLevel = (
    val: string | undefined,
    fallback: LogLevel,
  ): LogLevel => {
    if (!val) return fallback;
    const lc = val.toLowerCase();
    return (allowedLogLevels as readonly string[]).includes(lc)
      ? (lc as LogLevel)
      : fallback;
  };
  // Global/default log level for proxies
  const defaultLogLevel: LogLevel = normalizeLogLevel(
    process.env.PROXY_LOG_LEVEL || process.env.REACT_APP_PROXY_LOG_LEVEL,
    "debug",
  );

  // Upstream host (no path). Keep existing env override behavior.
  let target = process.env.UPSTREAM_TARGET || "";
  if (!target) {
    throw new Error(
      "[setupProxy] UPSTREAM_TARGET environment variable is not set for payslips upload proxy. Please set UPSTREAM_TARGET to a valid upstream URL for the payslips upload proxy.",
    );
  }
  // Normalize common mistakes (e.g., 'http:localhost:9090' or missing protocol)
  if (/^https?:localhost:\d+/.test(target)) {
    target = target.replace(/^(https?):/, "$1://");
  }
  if (target && !/^https?:\/\//.test(target)) {
    target = "http://" + target; // fallback assumption
  }
  // Final full URL = {target}/gov-superapp/microappbackendprodbranch/v1.0/admin-portal/upload
  const upstreamUploadPath = process.env.UPSTREAM_UPLOAD_PATH || "";

  app.use(
    ["/upload", "/api/payslips/upload"],
    createProxyMiddleware({
      target,
      changeOrigin: true,
      logLevel: defaultLogLevel,
      pathRewrite: (path: string) => {
        if (path === "/upload" || path === "/api/payslips/upload") {
          return upstreamUploadPath;
        }
        return path;
      },
      onError: (err: Error, res: any) => {
        // eslint-disable-next-line no-console
        console.error("[setupProxy] Proxy error:", err.message);
        if (!res.headersSent) {
          res.writeHead(502, { "Content-Type": "application/json" });
        }
        res.end(JSON.stringify({ error: "Bad gateway", detail: err.message }));
      },
    }),
  );

  // ---------------------------------------------------------------------------
  // Micro-app upload proxy (avoids browser CORS when calling remote gateway)
  const microAppsTarget = process.env.MICRO_APPS_TARGET || "";
  const microAppsBasePath = process.env.MICRO_APPS_BASE_PATH || "";
  const microAppsUploadPath = process.env.MICRO_APPS_UPLOAD_PATH || "";
  if (!microAppsTarget) {
    throw new Error(
      "[setupProxy] MICRO_APPS_TARGET environment variable is not set. Please set it to a valid upstream URL.",
    );
  }
  if (!microAppsBasePath) {
    throw new Error(
      "[setupProxy] MICRO_APPS_BASE_PATH environment variable is not set. Please set it to a valid base path.",
    );
  }
  if (!microAppsUploadPath) {
    throw new Error(
      "[setupProxy] MICRO_APPS_UPLOAD_PATH environment variable is not set. Please set it to a valid upload path.",
    );
  }

  // Allow an override specific to micro-apps proxy, falling back to default
  const microAppsLogLevel: LogLevel = normalizeLogLevel(
    process.env.MICROAPPS_PROXY_LOG_LEVEL ||
      process.env.REACT_APP_MICROAPPS_PROXY_LOG_LEVEL,
    defaultLogLevel,
  );

  app.use(
    "/api/microapps",
    createProxyMiddleware({
      target: microAppsTarget,
      changeOrigin: true,
      logLevel: microAppsLogLevel,
      pathRewrite: (path: string) => {
        if (path === "/api/microapps/upload") {
          return microAppsBasePath + microAppsUploadPath;
        }
        return path;
      },
      onProxyReq: (proxyReq: any) => {
        const shouldStrip = process.env.MICROAPPS_STRIP_ASSERTION === "true";
        // Type guard: ensure getHeader and removeHeader are functions before calling
        const hasGetHeader = typeof proxyReq.getHeader === "function";
        const hasRemoveHeader = typeof proxyReq.removeHeader === "function";
        const assertion = hasGetHeader
          ? proxyReq.getHeader("x-jwt-assertion")
          : undefined;
        if (shouldStrip && assertion && hasRemoveHeader) {
          proxyReq.removeHeader("x-jwt-assertion");
        }
      },
      onError: (err: Error, req: any, res: any) => {
        if (!res.headersSent) {
          res.writeHead(502, { "Content-Type": "application/json" });
        }
        res.end(
          JSON.stringify({
            error: "Bad gateway (microapps)",
            detail: err.message,
          }),
        );
      },
    }),
  );
}
