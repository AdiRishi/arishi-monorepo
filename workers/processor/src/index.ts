import type { ProcessorEnv } from "@repo/infra/worker-bindings";
import { WorkerEntrypoint } from "cloudflare:workers";
import { Effect, Layer } from "effect";

import { handleMessage } from "./artifacts/profile-job.ts";
import { processingRpc } from "./artifacts/rpc.ts";
import { processorResources } from "./platform/resources.ts";

export { CsvProfileSession } from "./artifacts/profile-session.ts";

/** The web app's view of how far profiling has got. */
export class ProcessingApi extends WorkerEntrypoint<ProcessorEnv> {
  override fetch(request: Request): Promise<Response> {
    return Effect.runPromise(
      Layer.build(processorResources(this.env)).pipe(
        Effect.flatMap((context) => Effect.promise(() => processingRpc.handler(request, context))),
        Effect.scoped,
      ),
    );
  }
}

export default {
  queue: (batch, env) =>
    Effect.runPromise(
      Effect.forEach(
        batch.messages,
        (message) => handleMessage(message, batch.queue === env.DEAD_LETTER_QUEUE_NAME),
        { discard: true },
      ).pipe(Effect.provide(processorResources(env))),
    ),
} satisfies ExportedHandler<ProcessorEnv>;
