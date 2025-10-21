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
 * Admin Portal Style Constants (TypeScript)
 *
 * Centralized styling constants for consistent theming, colors, and component styling.
 */

import type { CSSProperties } from 'react';

/** Color Palette */
export interface ColorPalette {
  primary: string;
  secondary: string;
  background: string;
  border: string;
  cardBackground: string;
  /** lighter alternative border for subtle surfaces */
  borderAlt?: string;
  error: string;
  warning: string;
  success: string;
  text: string;
  textMuted: string;
  /** slightly softer than text for long descriptions */
  textSubtle?: string;
  /** strong accent (e.g., avatars/indicators) */
  accent?: string;
  /** inverted surface for occasional emphasis */
  inverted?: string;
  invertedText?: string;
  /** error surface tokens for inline alerts */
  errorSurfaceBackground?: string;
  errorSurfaceBorder?: string;
  errorSurfaceText?: string;
}

export const COLORS: ColorPalette = {
  // Primary brand colors
  primary: '#003a67',
  secondary: '#09589c',

  // Background and surface colors
  background: '#f9fcff',
  border: '#e3f2ff',
  cardBackground: '#f5faff',
  borderAlt: '#e6f4ff',

  // Status and feedback colors
  error: '#b91c1c',
  warning: '#d97706',
  success: '#059669',

  // Text colors
  text: '#262626',
  textMuted: '#8c8c8c',
  textSubtle: '#595959',

  // Accents and special surfaces
  accent: '#1677ff',
  inverted: '#111111',
  invertedText: '#ffffff',
  errorSurfaceBackground: '#2d1f1f',
  errorSurfaceBorder: '#5a2f2f',
  errorSurfaceText: '#fca5a5',
};

/** Common Style Objects */

export interface CommonStyles {
  greeting: CSSProperties;
  card: CSSProperties;
  button: CSSProperties;
  buttonFocus: CSSProperties;
  section: CSSProperties;
  loadingText: CSSProperties;
  errorText: CSSProperties;
  /** inline error card style */
  alertError: CSSProperties;
  pageCentered: CSSProperties;
}

export const COMMON_STYLES: CommonStyles = {
  greeting: {
    textAlign: 'left',
    margin: '8px 0 12px',
    fontSize: '20px',
    fontWeight: '500',
    color: COLORS.primary,
  },

  card: {
    background: COLORS.cardBackground,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 4px 12px -2px rgba(0,58,103,0.08)',
  },

  button: {
    border: 'none',
    outline: 'none',
    boxShadow: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  buttonFocus: {
    boxShadow: '0 0 0 3px rgba(24,144,255,0.35)',
  },

  section: {
    marginTop: '0',
    background: '#ffffff',
    border: '1px solid rgb(208, 236, 255)',
    borderRadius: '16px',
    padding: '16px',
  },

  loadingText: {
    color: COLORS.secondary,
    marginBottom: '12px',
  },

  errorText: {
    color: COLORS.error,
    marginBottom: '12px',
  },

  alertError: {
    background: COLORS.errorSurfaceBackground,
    border: `1px solid ${COLORS.errorSurfaceBorder}`,
    color: COLORS.errorSurfaceText,
    borderRadius: '12px',
  },
  pageCentered: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    width: '100%',
  },
};
