import { expect, it } from "@effect/vitest";
import { Effect } from "effect";

import { artifactsApi, csv, profile, profilingApi, upload } from "./support/api.ts";

it.live("hands the processor a queued artifact's source once it starts profiling", () =>
  Effect.gen(function* () {
    const api = yield* artifactsApi;
    const processor = yield* profilingApi;
    const artifact = yield* upload(csv("a\n1\n"));

    expect(yield* processor.startProfile({ artifactId: artifact.id })).toBe(true);
    expect(
      new TextDecoder().decode(yield* processor.getProfileSource({ artifactId: artifact.id })),
    ).toBe("a\n1\n");
    expect(yield* api.getArtifact({ artifactId: artifact.id })).toMatchObject({
      status: "processing",
    });
  }),
);

it.live("lets a redelivered job resume an artifact left processing", () =>
  Effect.gen(function* () {
    const processor = yield* profilingApi;
    const artifact = yield* upload(csv("a\n1\n"));
    yield* processor.startProfile({ artifactId: artifact.id });

    expect(yield* processor.startProfile({ artifactId: artifact.id })).toBe(true);
  }),
);

it.live("keeps a completed result when the job is redelivered or a late failure arrives", () =>
  Effect.gen(function* () {
    const api = yield* artifactsApi;
    const processor = yield* profilingApi;
    const artifact = yield* upload(csv("a\n1\n"));
    yield* processor.completeProfile({ artifactId: artifact.id, profile: profile(1) });

    expect(yield* processor.startProfile({ artifactId: artifact.id })).toBe(false);
    yield* processor.failProfile({ artifactId: artifact.id, message: "Retries exhausted." });
    yield* processor.completeProfile({ artifactId: artifact.id, profile: profile(2) });

    expect(yield* api.getArtifact({ artifactId: artifact.id })).toMatchObject({
      status: "complete",
      profile: profile(1),
    });
  }),
);

it.live("keeps a failure when a late result arrives", () =>
  Effect.gen(function* () {
    const api = yield* artifactsApi;
    const processor = yield* profilingApi;
    const artifact = yield* upload(csv("a\n1\n"));
    yield* processor.failProfile({
      artifactId: artifact.id,
      message: "The CSV could not be profiled.",
    });

    expect(yield* processor.startProfile({ artifactId: artifact.id })).toBe(false);
    yield* processor.completeProfile({ artifactId: artifact.id, profile: profile(1) });

    expect(yield* api.getArtifact({ artifactId: artifact.id })).toMatchObject({
      status: "failed",
      error: "The CSV could not be profiled.",
    });
  }),
);
