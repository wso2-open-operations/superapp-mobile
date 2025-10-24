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
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Loading from "../common/Loading";

// Mock theme styles to make style assertions deterministic
jest.mock("../../constants/styles", () => ({
  COMMON_STYLES: {
    loadingText: {
      color: "blue",
      fontWeight: "bold",
    },
  },
}));

describe("Loading component (TS)", () => {
  test("renders with default message", () => {
    render(<Loading />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders with custom message", () => {
    render(<Loading message="Fetching micro-apps..." />);
    expect(screen.getByText("Fetching micro-apps...")).toBeInTheDocument();
  });

  test("merges default and custom styles, with custom overriding defaults", () => {
    const { container } = render(
      <Loading style={{ fontSize: "16px", color: "red" }} />,
    );

    const div = container.querySelector("div") as HTMLDivElement | null;
    expect(div).not.toBeNull();
    if (!div) return; // type guard for TS

    // Custom style applied
    expect(div).toHaveStyle("font-size: 16px");

    // Default style preserved
    expect(div).toHaveStyle("font-weight: bold");

    // Custom overrides default
    expect(div).toHaveStyle("color: red");
  });
});
