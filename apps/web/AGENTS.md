# Web application

Adishwar Rishi's personal website. It is a TanStack Start app (React 19 and
Vite) with file-based routing from TanStack Router and TanStack Query wired into
SSR through `@tanstack/react-router-ssr-query`. Alchemy deploys it as a
Cloudflare Website.

Before designing or restyling a page, load the `frontend-design` skill in
`.agents/skills/frontend-design/` at the repository root.

## Run the app

- `pnpm dev` at the repository root runs the whole stack through Alchemy. Use
  it for anything that reads Cloudflare bindings (`env.API`, `env.ENVIRONMENT`).
  Alchemy prints the web URL. It listens on port 1337, or the next free port
  when 1337 is taken. `pnpm dev` inside `apps/web` runs the same root command.
- `pnpm dev:ui` inside `apps/web` runs Vite alone on `http://localhost:8080`
  for UI work. It provides no bindings, so a route that imports
  `cloudflare:workers`, as `src/server/api-client.server.ts` does, fails there.

Alchemy injects the Cloudflare Vite integration during development and
deployment. Keep `vite.config.ts` free of deployment adapters such as
`@cloudflare/vite-plugin` or Nitro.

## Check changes

```bash
pnpm --filter @repo/web build
pnpm exec turbo test --filter @repo/web
pnpm --filter @repo/web typecheck
pnpm check
```

The E2E project runs the built Worker in `dist/`, so the Turbo test task builds
first.

## Layout

- `src/routes/`: file-based routes. The router plugin regenerates
  `src/routeTree.gen.ts`; leave that file to it.
- `src/components/ui/`: shadcn/ui primitives in the Base Vega style with Lucide
  icons. Add more with `pnpm exec shadcn add <component>` from `apps/web`.
- `src/lib/`: `AppProviders`, which the router's `Wrap` option puts around
  every route, the query client, and `cn`.
- `src/server/`: server-only calls to the API Worker.
- `src/global-styles/tailwind.css`: theme tokens.
- `tests/`: mirrors `src/`. A `.test.ts` file runs in Node, a `.test.tsx` file
  renders in Chromium, and `tests/e2e/` requests pages from the built Worker.

## Environment variables

Vite exposes only `VITE_*` variables to the client, and they are public. Keep
secrets out of them. Put local values in `.env.local`, which Git ignores, and
list each name with a safe placeholder in `.env.example`.
