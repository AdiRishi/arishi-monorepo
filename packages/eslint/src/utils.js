import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import tsEslint from 'typescript-eslint';
import { fileURLToPath } from 'url';

export const defineConfig = tsEslint.config;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
});
