/*
 * Project-level ESLint configuration for the admin portal
 */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: ["react-app", "react-app/jest", "plugin:testing-library/react"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    // Keep the main codebase friendly: disable noisy warnings for FOSS friendliness
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-empty-function": "off",
  },
  overrides: [
    {
      files: ["**/__tests__/**/*.{ts,tsx}", "**/*.test.{ts,tsx}"],
      rules: {
        // Reduce noise from opinionated testing-library rules for contributors
        "testing-library/no-node-access": "off",
        "testing-library/no-container": "off",
        "testing-library/no-wait-for-multiple-assertions": "off",
        "testing-library/no-wait-for-side-effects": "off",
        "testing-library/prefer-screen-queries": "off",
        "testing-library/prefer-find-by": "off",
        "import/first": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-empty-function": "off",
      },
    },
  ],
};
