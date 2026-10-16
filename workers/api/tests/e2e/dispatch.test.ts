import { expect, it } from "@effect/vitest";
import { setQueueAccepting } from "@repo/testing/queue";
import { applyD1Migrations, reset } from "cloudflare:test";
import { env } from "cloudflare:workers";
import { Effect } from "effect";

import { csv, dispatch, sentJobs, upload } from "./support/api.ts";

it.live("sends one profile job for an upload, and the cron sends no second", () =>
  Effect.gen(function* () {
    const artifact = yield* upload(csv("a\n1\n"));
    yield* Effect.promise(dispatch);

    expect(sentJobs()).toEqual([{ artifactId: artifact.id }]);
  }),
);

it.live("sends a job the queue refused on the next cron run", () =>
  Effect.gen(function* () {
    setQueueAccepting(false);
    const artifact = yield* upload(csv("a\n1\n"));
    setQueueAccepting(true);

    yield* Effect.promise(dispatch);
    yield* Effect.promise(dispatch);

    expect(sentJobs()).toEqual([{ artifactId: artifact.id }]);
  }),
);

it("sends jobs for artifacts stored before the delivery migration", async () => {
  await reset();
  await applyD1Migrations(env.DB, env.TEST_MIGRATIONS.slice(0, 1));
  await env.DB.prepare(
    `INSERT INTO artifacts (id, file_name, object_key, content_type, byte_size, status, created_at)
     VALUES ('11111111-1111-4111-8111-111111111111', 'original.csv', 'original.csv', 'text/csv', 9, 'queued', '2026-08-22T00:00:00Z')`,
  ).run();
  await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);

  await dispatch();

  expect(sentJobs()).toEqual([{ artifactId: "11111111-1111-4111-8111-111111111111" }]);
});
