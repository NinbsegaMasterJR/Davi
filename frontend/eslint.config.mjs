import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactHooks from "eslint-plugin-react-hooks";

const browserGlobals = {
  console: "readonly",
  document: "readonly",
  fetch: "readonly",
  setInterval: "readonly",
  clearInterval: "readonly",
  window: "readonly",
};

export default [
  {
    ignores: ["node_modules", "dist", "build"],
  },
  js.configs.recommended,
  ...tseslint.configs["flat/recommended"],
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: browserGlobals,
    },
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "@typescript-eslint/naming-convention": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "react-hooks/rules-of-hooks": "error",
    },
  },
];
