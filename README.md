# Arishi Monorepo

Adishwar Rishi's personal website and the Cloudflare platform it runs on. The repository started from [application-platform-starter](https://github.com/AdiRishi/application-platform-starter): a TypeScript monorepo where Alchemy owns the infrastructure graph and bindings, and Effect services implement application behavior.

The platform hosts one TanStack Start web app, `apps/web`, and an internal API Worker, `workers/api`.

## Run it locally

Use Node.js 24 and Corepack:

```sh
corepack enable
pnpm install
pnpm dev
```

Open the URL printed by Alchemy.

## Read the docs

The documentation is a [Blume](https://useblume.dev/) site. From the repository root:

```sh
pnpm docs:dev
```

Open the local URL printed by Blume. The docs server runs independently of the application and needs no Cloudflare credentials.

- [Get started](docs/getting-started.mdx)
- [Architecture and Worker RPC](docs/architecture.mdx)
- [Write tests](docs/testing.mdx)
- [Deploy the application](docs/deployment.mdx)
- [Architecture decisions](docs/adr/index.mdx)

Edit pages in `docs/`. Run `pnpm docs:doctor` to check content and `pnpm docs:build` to generate the static site in `dist/`.

## Common commands

| Command                 | Purpose                                                            |
| ----------------------- | ------------------------------------------------------------------ |
| `pnpm dev`              | Run the local application through Alchemy                          |
| `pnpm check`            | Lint code and check formatting                                     |
| `pnpm typecheck`        | Check production and test TypeScript projects                      |
| `pnpm test`             | Run unit and E2E tests                                             |
| `pnpm test:integration` | Run the browser journeys against a local Alchemy stack             |
| `pnpm plan`             | Preview production infrastructure changes                          |
| `pnpm prod`             | Deploy the production stage                                        |
| `pnpm sync:repos`       | Match source references in `.repos/` to pinned dependency versions |
