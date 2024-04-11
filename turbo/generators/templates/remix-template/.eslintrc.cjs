/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['@repo/eslint-config/remix-run.js'],
  rules: {
    '@typescript-eslint/consistent-type-definitions': 'off',
    'react/prop-types': 'off',
  },
};
