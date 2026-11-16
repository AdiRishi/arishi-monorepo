# Web application

Adishwar Rishi's personal website. It is a TanStack Start app (React 19 and
Vite) with file-based routing from TanStack Router and TanStack Query wired into
SSR through `@tanstack/react-router-ssr-query`. Alchemy deploys it as a
Cloudflare Website.

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

## Build the interface

Every interactive component comes from ui-sdk (`@ui-sdk/react`), which ships
behaviour and ARIA with no styles. Follow the ui-sdk skill: read
`node_modules/@ui-sdk/react/docs/llms.txt`, then the page for each component
you use. Style parts with Tailwind through their `data-*` state attributes.
Links and text stay plain HTML.

## Check the interface through the agent bridge

`src/lib/agent.ts` creates ui-sdk's agent bridge and registers its WebMCP
tools. In development the page also exposes it as `window.agent`. To check a
change in the running app, open it with `pnpm dev:ui` and evaluate in the page:

```js
agent.snapshot(); // each ui-sdk component: name, state, actions
await agent.act({ steps: [{ ref: "Copy email address", action: "press" }] });
```

Read names and state from the bridge. Take a screenshot for layout and colour.

Section links have no bridge action, since a plain link has none. Reach a
section through its URL hash, such as `/#work`.

[Write tests](../../docs/testing.mdx#interface-tests) covers interface tests,
which drive the page through the same bridge.

## Layout

- `src/routes/`: file-based routes. The router plugin regenerates
  `src/routeTree.gen.ts`; leave that file to it.
- `src/features/paper/`: the home page, written as a letter. `content.ts` holds
  its copy and links. `start-paper.ts` drives the pen, the drawings and the
  WebGPU paper, and finds its elements by the ids and classes in `page.tsx` and
  `paper.css`.
- `src/components/`: components every route shares, such as the toast region.
- `src/lib/`: `AppProviders`, which the router's `Wrap` option puts around
  every route, the agent bridge, and the query client.
- `src/server/`: server-only calls to the API Worker.
- `src/global-styles/tailwind.css`: the paper theme's colours, fonts and
  breakpoints, as Tailwind tokens.
- `tests/`: mirrors `src/`. A `.test.ts` file runs in Node, a `.test.tsx` file
  renders in Chromium, and `tests/e2e/` requests pages from the built Worker.

## Environment variables

Vite exposes only `VITE_*` variables to the client, and they are public. Keep
secrets out of them. Put local values in `.env.local`, which Git ignores, and
list each name with a safe placeholder in `.env.example`.
