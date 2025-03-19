module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
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
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error', // 确保Prettier的规则被ESLint检查
  },
};
