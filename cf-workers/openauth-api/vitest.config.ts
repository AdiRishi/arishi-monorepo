import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';

export default defineWorkersConfig({
  test: {
    server: {
      deps: {
        inline: ['@openauthjs/openauth', '@openauthjs/openauth/storage/memory'],
      },
    },
    poolOptions: {
      workers: {
        wrangler: { configPath: './wrangler.vitest.toml' },
      },
    },
  },
});
