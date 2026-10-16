import type { ApiEnv } from "@repo/infra/worker-bindings";

export default {
  fetch: () => new Response("Not found", { status: 404 }),
} satisfies ExportedHandler<ApiEnv>;
