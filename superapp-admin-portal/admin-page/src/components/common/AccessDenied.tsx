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

import React from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import LoginIcon from "@mui/icons-material/Login";
import { COMMON_STYLES } from "../../constants/styles";

export type AccessDeniedProps = {
  requiredGroups: string[];
  userGroups?: string[];
  error?: string | null;
  onSignOut?: () => void | Promise<void>;
  onRetry?: () => void;
  title?: string;
  message?: string;
};

const AccessDenied: React.FC<AccessDeniedProps> = ({
  requiredGroups,
  userGroups = [],
  error,
  onSignOut,
  onRetry,
  title = "Access Denied",
  message = "Unauthorized Access: You are not authorized to access this application. Please contact your administrator if you believe this is an error.",
}) => {
  return (
    <div style={{ ...COMMON_STYLES.pageCentered, padding: "20px" }}>
      <Card sx={{ maxWidth: 600, textAlign: "center", p: 2 }}>
        <CardContent>
          <ErrorOutlineIcon
            sx={{
              fontSize: 48,
              color: (theme) => theme.palette.error.main,
              mb: 2,
            }}
          />
          <Typography
            variant="h4"
            gutterBottom
            sx={{ color: (theme) => theme.palette.error.main }}
          >
            {title}
          </Typography>
          <Alert severity="error" sx={{ mb: 2, textAlign: "left" }}>
            {message}
          </Alert>
          <Typography variant="body1">
            <strong>Required Access:</strong> You need to be a member of one of
            the following groups:
          </Typography>

          <ul style={{ textAlign: "left", marginBottom: "24px" }}>
            {requiredGroups.map((group) => (
              <li key={group}>
                <code>{group}</code>
              </li>
            ))}
          </ul>

          {userGroups.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <Typography variant="body1">
                <strong>Your current groups:</strong>
              </Typography>
              <ul style={{ textAlign: "left" }}>
                {userGroups.map((group) => (
                  <li key={group}>
                    <code>{group}</code>
                  </li>
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
            {onSignOut && (
              <Button
                variant="contained"
                startIcon={<LoginIcon />}
                onClick={onSignOut}
              >
                Sign Out
              </Button>
            )}
            {onRetry && (
              <Button variant="outlined" onClick={onRetry}>
                Retry
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessDenied;
