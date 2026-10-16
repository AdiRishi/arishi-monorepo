# Web application

## Commands

```bash
pnpm dev
pnpm --filter @repo/web build
pnpm exec turbo test --filter @repo/web
pnpm --filter @repo/web typecheck
pnpm check
```

Run development through the root Alchemy stack so Cloudflare bindings are
available to TanStack's server runtime.

Alchemy injects the Cloudflare Vite integration during development and
deployment. Do not add `@cloudflare/vite-plugin` or another deployment adapter
to `vite.config.ts`.
