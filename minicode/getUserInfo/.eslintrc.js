module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    './eslint-config-tencent',
    './eslint-config-tencent/ts',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    curly: 'error', // 大括号约定
    'no-plusplus': 'off', // 允许++
    'no-undef': 'off', // eslint和ts冲突
    'no-empty': 'off',
    'no-debugger': 'error', // 禁用debugger
    'no-param-reassign': 'off', // 允许在for循环内直接操作对象
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-require-imports': ['off'], // 忽略no-require-imports规则
    '@typescript-eslint/prefer-optional-chain': 'off', // 忽略prefer-optional-chain规则
    '@typescript-eslint/no-explicit-any': 'error', // 允许any
    '@typescript-eslint/no-empty-function': 'off', // 允许有空函数
    'max-len': [
      'error',
      {
        code: 120,
        ignoreComments: true, // 忽略注释
        ignoreUrls: true, // 忽略地址
        ignoreTemplateLiterals: true, // 忽略模板字符串
        ignoreRegExpLiterals: true, // 忽略正则
      },
    ],
    // 命名规范
    '@typescript-eslint/naming-convention': [
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
    'implicit-arrow-linebreak': 0,
    'operator-linebreak': 0,

    // await相关
    "require-await": "error",
    "no-return-await": "error",
  },
};
