import { configs, defineConfig } from '@arishi/eslint';

export default defineConfig(...configs.base, ...configs.remix, {
  languageOptions: {
    parserOptions: {
      project: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
