# Alchemy infrastructure

Before changing an Alchemy stack, resource, or binding, fetch
[Alchemy's documentation index](https://alchemy.run/llms.txt) and read the pages
relevant to the change. Confirm API details against the installed Alchemy
package when the documentation and the pinned version differ.

Workers are plain modules: `Cloudflare.Worker` points `main` at a Worker's
`src/index.ts`, and the Worker types its env with `InferEnv` from
`src/worker-bindings.ts`. Bindings between Workers can't form a cycle.

Integration journeys follow [Alchemy's testing guide](https://alchemy.run/testing/testing-a-stack/).
`pnpm test:integration` runs them against local providers with `dev: true` and
must not create cloud resources. Keep Vitest's `sequence.hooks` set to `"list"`:
`destroy(Stack)` must run before Alchemy's fallback runtime cleanup.
[Write tests](../docs/testing.mdx) covers the rest.
