import { ProfileJob } from "@repo/contracts/artifacts";
import { Effect, Function, Schema } from "effect";

import { InvalidProfileJob } from "./errors.ts";
import { ArtifactProcessing } from "./service.ts";

const parseJob = Function.flow(
  Schema.decodeUnknownEffect(ProfileJob),
  Effect.mapError((cause) => new InvalidProfileJob({ cause })),
);

/** Acknowledges a job once it is settled or unreadable, and retries it after a failure. */
export const handleMessage = Effect.fn("ArtifactProcessing.handleMessage")(function* (
  message: Message<unknown>,
  deadLetter: boolean,
) {
  const job = yield* parseJob(message.body).pipe(
    Effect.tapError(() => Effect.logWarning("Discarding an invalid profile queue message")),
    Effect.option,
  );
  if (job._tag === "None") {
    message.ack();
    return;
  }
  const { artifactId } = job.value;
  const processing = yield* ArtifactProcessing;
  yield* (deadLetter ? processing.exhaust(job.value) : processing.process(job.value)).pipe(
    Effect.matchEffect({
      onFailure: (failure) =>
        Effect.logError(
          deadLetter ? "Dead-letter handling failed" : "CSV profile attempt failed",
          failure.cause,
        ).pipe(
          Effect.annotateLogs({ artifactId, message: failure.message }),
          Effect.andThen(Effect.sync(() => message.retry())),
        ),
      onSuccess: () => Effect.sync(() => message.ack()),
    }),
  );
});
