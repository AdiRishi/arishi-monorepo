import * as Cloudflare from "alchemy/Cloudflare";
import * as Test from "alchemy/Test/Vitest";
import * as Effect from "effect/Effect";
import { HttpClient, HttpClientResponse } from "effect/http";
import { ChildProcess, ChildProcessSpawner } from "effect/process";
import * as Schedule from "effect/Schedule";
import * as Schema from "effect/Schema";
import { expect } from "vitest";

import Stack from "../../alchemy.run.ts";

/*
 * Runs the whole stack locally, as `pnpm dev` does, then follows people
 * through it with the Playwright journeys in `journeys/`. Test.make stays in
 * this file: Alchemy's cleanup hook must run after `afterAll(destroy(Stack))`.
 */

const { test, beforeAll, afterAll, deploy, destroy } = Test.make({
  providers: Cloudflare.providers(),
  stage: `test-${crypto.randomUUID().slice(0, 8)}`,
  dev: true,
});

const stack = beforeAll(
  deploy(Stack).pipe(
    Effect.flatMap(Schema.decodeUnknownEffect(Schema.Struct({ websiteUrl: Schema.String }))),
    // The website answers once its Vite dev server has started.
    Effect.tap(({ websiteUrl }) =>
      HttpClient.get(websiteUrl).pipe(
        Effect.flatMap(HttpClientResponse.filterStatusOk),
        Effect.retry({ schedule: Schedule.spaced("500 millis"), times: 60 }),
      ),
    ),
  ),
  { timeout: 600_000 },
);
afterAll(destroy(Stack), { timeout: 600_000 });

test(
  "the journeys pass against the local stack",
  Effect.gen(function* () {
    const { websiteUrl } = yield* stack;
    const spawner = yield* ChildProcessSpawner.ChildProcessSpawner;
    const exitCode = yield* spawner.exitCode(
      ChildProcess.make("pnpm", ["exec", "playwright", "test"], {
        env: { APPLICATION_URL: websiteUrl },
        extendEnv: true,
        stdout: "inherit",
        stderr: "inherit",
      }),
    );
    expect(exitCode).toBe(0);
  }),
  { timeout: 600_000 },
);
