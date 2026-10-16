import * as Cloudflare from "alchemy/Cloudflare";
import { Effect } from "effect";

import { workerCompatibility, workerObservability } from "./cloudflare-config.ts";
import { dataPlane } from "./data-plane.ts";
import type { DeploymentConfig } from "./deployment-config.ts";
import { apiBindings, processorBindings } from "./worker-bindings.ts";

export const workerGraph = Effect.fn("ApplicationPlatform.WorkerGraph")(function* (
  config: DeploymentConfig,
) {
  const data = yield* dataPlane;

  const api = yield* Cloudflare.Worker("ApiWorker", {
    main: "../workers/api/src/index.ts",
    compatibility: workerCompatibility,
    workersDev: false,
    observability: workerObservability,
    crons: ["* * * * *"],
    env: apiBindings(data, config.environment),
  });

  const processor = yield* Cloudflare.Worker("ProcessorWorker", {
    main: "../workers/processor/src/index.ts",
    compatibility: workerCompatibility,
    workersDev: false,
    observability: workerObservability,
    env: processorBindings(data, api),
  });

  yield* Cloudflare.Queues.Consumer("ProfileJobsConsumer", {
    queueId: data.profileJobs.queueId,
    scriptName: processor.workerName,
    deadLetterQueue: data.deadLetters.queueName,
    settings: { batchSize: 1, maxRetries: 3 },
  });
  yield* Cloudflare.Queues.Consumer("ProfileDeadLettersConsumer", {
    queueId: data.deadLetters.queueId,
    scriptName: processor.workerName,
    settings: { batchSize: 1 },
  });

  return { api, processor };
});

export type Workers = Effect.Success<ReturnType<typeof workerGraph>>;
