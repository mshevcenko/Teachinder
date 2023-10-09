module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'no-unused-vars': 'off',
    'no-plusplus': 'off',
    'no-prototype-builtins': 'off',
    'no-param-reassign': 'off',
    'no-mixed-operators': 'off',
    'import/extensions': 'off',
  },
};
