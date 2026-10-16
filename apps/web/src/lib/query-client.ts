import { AppRequestError } from "@repo/contracts/app";
import { QueryClient } from "@tanstack/react-query";

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failures, error) =>
          error instanceof AppRequestError && error.code === "unavailable" && failures < 2,
      },
      mutations: { retry: false },
    },
  });
