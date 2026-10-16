import { AppRequestError } from "@repo/contracts/app";
import type { ArtifactsUnavailable, ProcessingUnavailable } from "@repo/contracts/artifacts";
import { Effect } from "effect";

const unavailable = (failure: ArtifactsUnavailable | ProcessingUnavailable) =>
  Effect.logError("Artifact request failed", failure).pipe(
    Effect.andThen(
      Effect.fail(
        new AppRequestError(
          "unavailable",
          "The service is temporarily unavailable. Please try again.",
        ),
      ),
    ),
  );

export const artifactRequestErrors = {
  ArtifactNotFound: () => Effect.fail(new AppRequestError("not_found", "Artifact not found.")),
  ArtifactsUnavailable: unavailable,
  ProcessingUnavailable: unavailable,
};
