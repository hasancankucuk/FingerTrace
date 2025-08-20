import { defineFlatConfig } from 'eslint-define-config';
import parser from '@typescript-eslint/parser';
import plugin from '@typescript-eslint/eslint-plugin';


export default defineFlatConfig([
  {
    files: ["**/*.js", "**/*.cjs", "**/*.mjs", "**/*.ts"],
    languageOptions: {
      parser: parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': plugin,
    },
    rules: {
      "prefer-const": "warn",
      "no-constant-binary-expression": "error",
      "@typescript-eslint/no-explicit-any": "off",
      ...plugin.configs.recommended.rules,
    },
  }
]);