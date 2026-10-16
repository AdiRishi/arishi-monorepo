import { expect, it } from "@effect/vitest";
import { env } from "cloudflare:workers";
import { Effect } from "effect";

import { storeArtifact } from "./support/api.ts";
import { artifactId, deliver, processingApi } from "./support/jobs.ts";

it.live("reports an artifact it has not started as queued", () =>
  Effect.gen(function* () {
    const processing = yield* processingApi;

    expect(yield* processing.getProcessingState({ artifactId })).toEqual({ kind: "queued" });
  }),
);

it.live("reports the rows it has profiled", () =>
  Effect.gen(function* () {
    const processing = yield* processingApi;
    storeArtifact(artifactId, "amount\n1\n2\n3\n");
    yield* Effect.promise(() => deliver({ artifactId }));

    expect(yield* processing.getProcessingState({ artifactId })).toEqual({
      kind: "processing",
      rowsProcessed: 3,
      totalRows: 3,
    });
  }),
);

it("never moves an artifact's progress backward", async () => {
  const session = env.PROFILE_SESSIONS.getByName(artifactId);
  await session.progress(5, 10);
  await session.progress(3, 10);

  expect(await session.getState()).toEqual({
    state: { kind: "processing", rowsProcessed: 5, totalRows: 10 },
  });
});
