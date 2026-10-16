import { expect, it } from "@effect/vitest";
import { ArtifactNotFound, ArtifactsUnavailable } from "@repo/contracts/artifacts";
import { env } from "cloudflare:workers";
import { Effect } from "effect";

import {
  artifactsApi,
  csv,
  download,
  profile,
  profilingApi,
  unknownArtifact,
  upload,
} from "./support/api.ts";

it.live("lists artifacts newest first", () =>
  Effect.gen(function* () {
    const api = yield* artifactsApi;
    const first = yield* upload(csv("a\n1\n", "first.csv"));
    const second = yield* upload(csv("a\n2\n", "second.csv"));

    expect((yield* api.listArtifacts()).map(({ id }) => id)).toEqual([second.id, first.id]);
  }),
);

it.live("serves a completed artifact with its profile and a failed one with its error", () =>
  Effect.gen(function* () {
    const api = yield* artifactsApi;
    const processor = yield* profilingApi;
    const completed = yield* upload(csv("a\n1\n", "completed.csv"));
    const failed = yield* upload(csv("a\n1\n", "failed.csv"));
    yield* processor.completeProfile({ artifactId: completed.id, profile: profile(1) });
    yield* processor.failProfile({
      artifactId: failed.id,
      message: "The CSV could not be profiled.",
    });

    expect(yield* api.getArtifact({ artifactId: completed.id })).toMatchObject({
      status: "complete",
      profile: profile(1),
    });
    expect(yield* api.getArtifact({ artifactId: failed.id })).toMatchObject({
      status: "failed",
      error: "The CSV could not be profiled.",
    });
    expect(yield* api.listArtifacts()).toMatchObject([
      { id: failed.id, status: "failed", error: "The CSV could not be profiled." },
      { id: completed.id, status: "complete", rowCount: 1, malformedRows: 0 },
    ]);
  }),
);

it.live("answers not found for an unknown artifact", () =>
  Effect.gen(function* () {
    const api = yield* artifactsApi;

    expect(yield* Effect.flip(api.getArtifact({ artifactId: unknownArtifact }))).toEqual(
      new ArtifactNotFound({ artifactId: unknownArtifact }),
    );
  }),
);

it.live("refuses to serve a stored profile it cannot read, and still serves the source", () =>
  Effect.gen(function* () {
    const api = yield* artifactsApi;
    const processor = yield* profilingApi;
    const artifact = yield* upload(csv("a\n1\n"));
    yield* processor.completeProfile({ artifactId: artifact.id, profile: profile(1) });
    // No entrypoint writes a corrupt profile; storage can still hold one.
    yield* Effect.promise(() =>
      env.DB.prepare("UPDATE artifacts SET profile_json = '{}' WHERE id = ?")
        .bind(artifact.id)
        .run(),
    );

    expect(yield* Effect.flip(api.getArtifact({ artifactId: artifact.id }))).toEqual(
      new ArtifactsUnavailable({}),
    );
    expect(yield* Effect.flip(api.listArtifacts())).toEqual(new ArtifactsUnavailable({}));
    const source = yield* Effect.promise(() => download(artifact.id));
    expect(yield* Effect.promise(() => source.text())).toBe("a\n1\n");
  }),
);
