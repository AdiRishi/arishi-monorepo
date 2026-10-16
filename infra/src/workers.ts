import * as Cloudflare from "alchemy/Cloudflare";
import { Effect } from "effect";

import { workerCompatibility, workerObservability } from "./cloudflare-config.ts";
import type { DeploymentConfig } from "./deployment-config.ts";
import { apiBindings } from "./worker-bindings.ts";

export const workerGraph = Effect.fn("ApplicationPlatform.WorkerGraph")(function* (
  config: DeploymentConfig,
) {
  const api = yield* Cloudflare.Worker("ApiWorker", {
    main: "../workers/api/src/index.ts",
    compatibility: workerCompatibility,
    workersDev: false,
    observability: workerObservability,
    env: apiBindings(config.environment),
  });

  return { api };
});

export type Workers = Effect.Success<ReturnType<typeof workerGraph>>;
