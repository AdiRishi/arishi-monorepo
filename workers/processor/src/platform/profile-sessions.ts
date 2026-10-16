import type { ArtifactId, ProcessingState } from "@repo/contracts/artifacts";
import type { ProcessorEnv } from "@repo/infra/worker-bindings";
import { Context, Effect, Layer } from "effect";

import { ProfileFailure } from "../artifacts/errors.ts";

export class ProfileSessions extends Context.Service<
  ProfileSessions,
  {
    readonly getProcessingState: (
      artifactId: ArtifactId,
    ) => Effect.Effect<ProcessingState, ProfileFailure>;
    readonly reportProgress: (options: {
      readonly artifactId: ArtifactId;
      readonly rowsProcessed: number;
      readonly totalRows: number;
    }) => Effect.Effect<void>;
  }
>()("Processor/ProfileSessions") {
  static readonly layer = (sessions: ProcessorEnv["PROFILE_SESSIONS"]) =>
    Layer.succeed(
      ProfileSessions,
      ProfileSessions.of({
        getProcessingState: Effect.fn("ProfileSessions.getProcessingState")(function* (artifactId) {
          const { state } = yield* Effect.tryPromise({
            try: () => sessions.getByName(artifactId).getState(),
            catch: (cause) =>
              new ProfileFailure({ cause, message: "The profile session could not be read." }),
          });
          return state;
        }),
        reportProgress: Effect.fn("ProfileSessions.reportProgress")(function* ({
          artifactId,
          rowsProcessed,
          totalRows,
        }) {
          yield* Effect.tryPromise(() =>
            sessions.getByName(artifactId).progress(rowsProcessed, totalRows),
          ).pipe(
            Effect.catchCause((cause) =>
              Effect.logWarning("Profile progress unavailable", cause).pipe(
                Effect.annotateLogs({ artifactId }),
              ),
            ),
          );
        }),
      }),
    );
}
