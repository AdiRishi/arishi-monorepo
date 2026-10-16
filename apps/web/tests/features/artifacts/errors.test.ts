import { AppRequestError } from "@repo/contracts/app";
import {
  ArtifactId,
  ArtifactNotFound,
  ArtifactsUnavailable,
  ProcessingUnavailable,
} from "@repo/contracts/artifacts";
import { Effect } from "effect";
import { expect, test } from "vitest";

import { artifactRequestErrors } from "@/features/artifacts/errors";
import { runApiRequest } from "@/server/api-request";

const artifactId = ArtifactId.make("28f31da1-a2ed-4f1f-a9d9-463107ad09f0");
const unavailable = new AppRequestError(
  "unavailable",
  "The service is temporarily unavailable. Please try again.",
);

test.each([
  [new ArtifactNotFound({ artifactId }), new AppRequestError("not_found", "Artifact not found.")],
  [new ArtifactsUnavailable({}), unavailable],
  [new ProcessingUnavailable({}), unavailable],
])("%s becomes a safe browser error", async (failure, expected) => {
  const request: Effect.Effect<never, typeof failure> = Effect.fail(failure);

  await expect(
    runApiRequest(
      request.pipe(Effect.catchTags(artifactRequestErrors)),
      new AbortController().signal,
    ),
  ).rejects.toEqual(expected);
});
