import js from '@eslint/js';
import path from "path";
import { fileURLToPath } from "url";
import globals from "globals";
import { defineConfig, globalIgnores } from "@eslint/config-helpers";
import { FlatCompat } from "@eslint/eslintrc";
import js from '@eslint/js';
import { fixupConfigRules } from "@eslint/compat";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

  const compatWithRecommended = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
  });
export default defineConfig([
  globalIgnores([""node_modules"",""dist"",""libs"",""*.js"",".DS_Store",".vscode/c_cpp_properties.json","node_modules/","package-lock.json"]),
  {
    extends: fixupConfigRules(compatWithRecommended.extends(
      js.configs.recommended,
      "plugin:prettier/recommended"
    )),
    languageOptions: {
      globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
        wx: 'readonly',
        canvas: 'readonly',
        require: 'readonly',
        module: 'readonly',
        worker: 'readonly',
        exports: 'readonly',
        GameGlobal: 'readonly',
        requirePlugin: 'readonly',
        ...globals.browser,
        ...globals.es6
      },
      sourceType: 'module',
      parserOptions: {
        ecmaVersion: 2018
      }
    },
    rules: {
      "prettier/prettier": 'error',
      "no-constant-binary-expression": 'off',
      "no-empty-static-block": 'off',
      "no-new-native-nonconstructor": 'off',
      "no-unused-private-class-members": 'off'
    },
  }
]);
