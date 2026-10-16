import {
  type ArtifactId,
  type ProcessingState,
  ProcessingRpcs,
  ProcessingUnavailable,
} from "@repo/contracts/artifacts";
import { rpcWebHandler } from "@repo/contracts/server";
import { WorkerEntrypoint } from "cloudflare:workers";
import { Context, Effect } from "effect";

/*
 * Stands in for the processor Worker, which the web app asks how far an
 * artifact's profile has got. Tests report progress or take it down.
 */

let progress = new Map<ArtifactId, ProcessingState>();
let available = true;

export const reportProgress = (artifactId: ArtifactId, state: ProcessingState) => {
  progress.set(artifactId, state);
};

export const takeProcessorDown = () => {
  available = false;
};

export const resetProcessor = () => {
  progress = new Map();
  available = true;
};

const processingRpc = rpcWebHandler(
  ProcessingRpcs,
  ProcessingRpcs.toLayer({
    getProcessingState: ({ artifactId }) =>
      Effect.suspend(() =>
        available
          ? Effect.succeed(progress.get(artifactId) ?? { kind: "queued" })
          : Effect.fail(new ProcessingUnavailable({})),
      ),
  }),
);

export class ProcessingStandIn extends WorkerEntrypoint {
  override fetch(request: Request): Promise<Response> {
    return processingRpc.handler(request, Context.empty());
  }
}
