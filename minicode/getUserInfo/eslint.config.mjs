import path from "path";
import { fileURLToPath } from "url";
import typescriptParser from "@typescript-eslint/parser";
import globals from "globals";
import { defineConfig, globalIgnores } from "@eslint/config-helpers";
import { FlatCompat } from "@eslint/eslintrc";
import { fixupConfigRules } from "@eslint/compat";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

  const compat = new FlatCompat({
    baseDirectory: __dirname,
  });
export default defineConfig([
  globalIgnores(["node_modules","dist",'.eslintrc.js']),
  {
    extends: fixupConfigRules(compat.extends(
      "plugin:@typescript-eslint/recommended",
      "plugin:prettier/recommended"
    )),
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest
      },
      sourceType: 'module',
      parser: typescriptParser,
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname
      }
    },
    rules: {
      curly: 'error',
      "no-plusplus": 'off',
      "no-undef": 'off',
      "no-empty": 'off',
      "no-debugger": 'error',
      "no-param-reassign": 'off',
      "@typescript-eslint/interface-name-prefix": 'off',
      "@typescript-eslint/explicit-function-return-type": 'off',
      "@typescript-eslint/explicit-module-boundary-types": 'off',
      "@typescript-eslint/no-require-imports": ['off'],
      "@typescript-eslint/prefer-optional-chain": 'off',
      "@typescript-eslint/no-explicit-any": 'error',
      "@typescript-eslint/no-empty-function": 'off',
      "max-len": [
      'error',
      {
        code: 120,
        ignoreComments: true, // 忽略注释
        ignoreUrls: true, // 忽略地址
        ignoreTemplateLiterals: true, // 忽略模板字符串
        ignoreRegExpLiterals: true, // 忽略正则
      },
    ],
      "@typescript-eslint/naming-convention": [
      'error',
      // 函数可以使用驼峰
      // FIXME: #197 为了兼容 React 函数组件允许使用 PascalCase，但在未来 React 规则推出后将删除
      {
        selector: 'function',
        format: ['camelCase', 'PascalCase'],
      },
      // 内部变量使用驼峰法
      // FIXME: 因为 types 没有单独的对象参数，所以这里将 UPPPER_CASE 也加入了内部变量允许的写法，这样才能允许导出对象时使用 UPPER_CASE
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE', 'snake_case'],
      },
      // 全局对象各种写法都可以支持，以应对不同类库的支持
      {
        selector: 'variable',
        modifiers: ['global'],
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
      },
      // 函数引用使用驼峰法、或者首字母大写（React 组件）
      {
        selector: 'variable',
        format: ['camelCase', 'PascalCase'],
        types: ['function'],
      },
      // 导出的布尔值，字符串、数字、数组使用全大写，下划线分割单词
      {
        selector: 'variable',
        modifiers: ['exported'],
        format: ['UPPER_CASE'],
        types: ['boolean', 'string', 'number', 'array'],
      },
      // 导出的 function 使用 camelCase
      {
        selector: 'variable',
        modifiers: ['exported'],
        format: ['camelCase', 'PascalCase'],
        types: ['function'],
      },
      // 类名和类型定义使用首字母大写
      {
        selector: ['class', 'typeLike'],
        format: ['PascalCase'],
      },
      // 类成员方法使用驼峰法，并阻止使用下划线开头和结尾
      {
        selector: ['classMethod', 'classProperty'],
        leadingUnderscore: 'forbid', // 阻止使用下划线开始
        trailingUnderscore: 'forbid', // 阻止使用下划线结尾
        format: ['camelCase', 'snake_case'],
      },
    ],
      "implicit-arrow-linebreak": 0,
      "operator-linebreak": 0,
      "require-await": "error",
      "no-return-await": "error"
    },
  }
]);
