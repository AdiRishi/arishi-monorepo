import { ProcessingRpcs, ProcessingUnavailable } from "@repo/contracts/artifacts";
import { rpcWebHandler } from "@repo/contracts/server";
import { Effect } from "effect";

import { ArtifactProcessing } from "./service.ts";

export const processingRpc = rpcWebHandler(
  ProcessingRpcs,
  ProcessingRpcs.toLayer({
    getProcessingState: ({ artifactId }) =>
      ArtifactProcessing.use((processing) => processing.getProcessingState(artifactId)).pipe(
        Effect.catchTag("ProfileFailure", (failure) =>
          Effect.logError(failure.message, failure.cause).pipe(
            Effect.annotateLogs({ artifactId }),
            Effect.andThen(Effect.fail(new ProcessingUnavailable({}))),
          ),
        ),
      ),
  }),
);
