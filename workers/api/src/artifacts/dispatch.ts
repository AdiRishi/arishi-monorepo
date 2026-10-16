import type { ApiEnv } from "@repo/infra/worker-bindings";
import { Effect } from "effect";

import { apiResources } from "../platform/resources.ts";
import { StorageFailure } from "./errors.ts";
import { ArtifactRepository } from "./repository.ts";

const sendPendingJobs = Effect.fn("Artifacts.dispatchProfiles")(function* (
  queue: ApiEnv["PROFILE_JOBS"],
) {
  const repository = yield* ArtifactRepository;
  const pending = yield* repository.pendingDelivery;
  yield* Effect.forEach(
    pending,
    ({ id }) =>
      Effect.tryPromise({
        try: () => queue.send({ artifactId: id }),
        catch: (cause) => new StorageFailure({ cause, operation: "send profile job" }),
      }).pipe(
        Effect.andThen(repository.markDispatched(id)),
        Effect.catch((failure) =>
          Effect.logError("Profile delivery failed", failure.cause).pipe(
            Effect.annotateLogs({ artifactId: id, operation: failure.operation }),
          ),
        ),
      ),
    { discard: true },
  );
});

/** Sends a profile job for every queued artifact the queue has not accepted yet. */
export const dispatchProfiles = (env: ApiEnv): Promise<void> =>
  Effect.runPromise(
    sendPendingJobs(env.PROFILE_JOBS).pipe(
      Effect.catch((failure) =>
        Effect.logError("Profile dispatch failed", failure.cause).pipe(
          Effect.annotateLogs({ operation: failure.operation }),
        ),
      ),
      Effect.provide(apiResources(env)),
    ),
  );
