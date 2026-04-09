import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

const nodeGlobals = {
  console: "readonly",
  process: "readonly",
};

export default [
  {
    ignores: ["node_modules", "dist", "build"],
  },
  js.configs.recommended,
  ...tseslint.configs["flat/recommended"],
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: "module",
      globals: nodeGlobals,
    },
    rules: {
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];
