import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";

import { createQueryClient } from "@/lib/query-client";

import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  // QueryClient must be created per getRouter() call: TanStack Start calls the
  // router factory once per SSR request, and a shared cache would leak data
  // across requests.
  const queryClient = createQueryClient();

  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    context: { queryClient },
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });

  return router;
};

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
