import { configs, defineConfig } from '@arishi/eslint';

export default defineConfig(
  ...configs.base,
  { ignores: ['vitest.config.ts'] },
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  }
);
