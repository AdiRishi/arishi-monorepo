# Application Platform Starter

A TypeScript monorepo for Cloudflare applications with multiple web apps, Workers, and shared resources. Alchemy owns the infrastructure graph and bindings; Effect services implement application behavior.

The included CSV profiler connects a TanStack Start web app, an API Worker, and a background processor through D1, R2, Queues, and a Durable Object.

## Start a project

Use Node.js 24 and Corepack:

```sh
npx degit AdiRishi/application-platform-starter acme-platform
cd acme-platform
corepack enable
pnpm install
pnpm rename acme-platform
pnpm install
pnpm dev
```

Run `rename` once on a fresh copy. Open the URL printed by Alchemy and upload `fixtures/transactions.csv` to exercise the platform.

When you start your own application, follow [Remove the sample application](docs/getting-started.mdx#remove-the-sample-application).

The sample is anonymous and shared: every visitor can list and download uploaded files. Replace it before handling private data.

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
