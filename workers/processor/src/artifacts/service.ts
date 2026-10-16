import type { ArtifactId, ProcessingState, ProfileJob } from "@repo/contracts/artifacts";
import { Context, Crypto, Effect, Layer } from "effect";

import { ArtifactClient } from "../platform/artifact-client.ts";
import { ProfileSessions } from "../platform/profile-sessions.ts";
import { ProfileFailure } from "./errors.ts";
import { profileCsv } from "./profile-csv.ts";

export class ArtifactProcessing extends Context.Service<
  ArtifactProcessing,
  {
    readonly exhaust: (job: ProfileJob) => Effect.Effect<void, ProfileFailure>;
    readonly getProcessingState: (
      artifactId: ArtifactId,
    ) => Effect.Effect<ProcessingState, ProfileFailure>;
    readonly process: (job: ProfileJob) => Effect.Effect<void, ProfileFailure>;
  }
>()("Processor/ArtifactProcessing") {
  static readonly layer = Layer.effect(
    ArtifactProcessing,
    Effect.gen(function* () {
      const artifacts = yield* ArtifactClient;
      const sessions = yield* ProfileSessions;
      const crypto = yield* Crypto.Crypto;

      return ArtifactProcessing.of({
        exhaust: Effect.fn("ArtifactProcessing.exhaust")(function* (job) {
          const message = "CSV profiling exhausted its retries.";
          yield* artifacts.failProfile({ artifactId: job.artifactId, message });
        }),
        getProcessingState: sessions.getProcessingState,
        process: Effect.fn("ArtifactProcessing.process")(function* (job) {
          const active = yield* artifacts.startProfile({ artifactId: job.artifactId });
          if (!active) return;
          const bytes = yield* artifacts.getProfileSource({ artifactId: job.artifactId });
          const parsed = yield* Effect.result(
            profileCsv(bytes, (rowsProcessed, totalRows) =>
              sessions.reportProgress({ artifactId: job.artifactId, rowsProcessed, totalRows }),
            ).pipe(Effect.provideService(Crypto.Crypto, crypto)),
          );
          if (parsed._tag === "Failure") {
            if (parsed.failure._tag === "PlatformError") {
              return yield* new ProfileFailure({
                cause: parsed.failure,
                message: "The CSV digest could not be computed.",
              });
            }
            yield* artifacts.failProfile({
              artifactId: job.artifactId,
              message: parsed.failure.message,
            });
            return;
          }
          const profile = parsed.success;
          yield* artifacts.completeProfile({ artifactId: job.artifactId, profile });
          yield* Effect.logInfo("CSV profile completed").pipe(
            Effect.annotateLogs({ artifactId: job.artifactId, rows: profile.rowCount }),
          );
        }),
      });
    }),
  );
}
