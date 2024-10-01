import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import jsdoc from 'eslint-plugin-jsdoc';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import * as regexpPlugin from 'eslint-plugin-regexp';
import pluginSecurity from 'eslint-plugin-security';
import turboPlugin from 'eslint-plugin-turbo';
import globals from 'globals';
import tsEslint from 'typescript-eslint';
import { defineConfig, compat } from '../utils.js';

export const base = defineConfig(
  {
    ignores: [
      '.next',
      '.astro',
      'dist',
      'storybook-static',
      '.wrangler',
      'build',
      '.prettierrc.js',
      'eslint.config.mjs',
      'postcss.config.js',
    ],
  },

  // Base JS/TS configs
  js.configs.recommended,
  ...tsEslint.configs.recommendedTypeChecked,
  ...tsEslint.configs.stylisticTypeChecked,

  // Good to have extras
  eslintPluginPrettier,
  eslintConfigPrettier,
  regexpPlugin.configs['flat/recommended'],
  pluginSecurity.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
    },
  },

  // JSDoc plugin only for TypeScript files
  {
    files: ['**/*.{ts,tsx}'],
    extends: [jsdoc.configs['flat/recommended-typescript']],
  },

  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/consistent-indexed-object-style': 'off',
      'security/detect-object-injection': 'off',
      'jsdoc/require-jsdoc': 'off',
    },
  }
);
