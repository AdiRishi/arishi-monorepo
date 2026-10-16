import { createFileRoute } from "@tanstack/react-router";

import { fetchApi } from "@/server/api-client.server";

export const Route = createFileRoute("/api/artifacts")({
  server: { handlers: { POST: ({ request }) => fetchApi("/api/artifacts", request) } },
});
