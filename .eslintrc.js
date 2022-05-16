module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'airbnb'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: [
    'react',
    'react-hooks'
  ],
  globals: {
    Number: true
  },
  rules: {
    'react-hooks/exhaustive-deps': 'off',
    'no-return-assign': 'off',
    'comma-dangle': ['error', 'never'],
    'react/no-array-index-key': 0,
    'no-multiple-empty-lines': [
      2,
      {
        max: 1,
        maxEOF: 1
      }
    ],
    'react/prop-types': 0,
    'no-alert': 'off',
    'no-shadow': 'off',
    'no-param-reassign': 'off'
  }
};
