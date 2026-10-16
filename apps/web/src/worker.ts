import type { WebsiteEnv } from "@repo/infra/worker-bindings";
import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";

const handler = createStartHandler(defaultStreamHandler);

export default {
  fetch: (request) => handler(request),
} satisfies ExportedHandler<WebsiteEnv>;
