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
 * Reusable Card Component (TypeScript)
 *
 * A standardized container component that provides consistent styling for
 * content sections throughout the admin portal. Implements the design system's
 * card styling with proper spacing, borders, and shadows.
 */

import React from 'react';
import { COMMON_STYLES } from '../../constants/styles';

export type CardProps = {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
};

const Card: React.FC<CardProps> = ({ children, style = {}, className = '' }) => {
  return (
    <div
      className={`card ${className}`}
      style={{
        // Apply design system card styles first, allow custom overrides to win
        ...(COMMON_STYLES.card as React.CSSProperties),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Card;
