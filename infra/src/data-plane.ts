import * as Cloudflare from "alchemy/Cloudflare";
import * as Effect from "effect/Effect";

import { bucketLifecycleRules } from "./cloudflare-config.ts";

// All starter data is disposable, including in prod. Destructive teardown is
// intentional for D1 and R2; production retention safeguards are not required.
export const ArtifactsDatabase = Cloudflare.D1.Database("ArtifactsDatabase", {
  migrations: "../workers/api/migrations",
});
export const ArtifactsBucket = Cloudflare.R2.Bucket("ArtifactsBucket", {
  forceDestroy: true,
  lifecycleRules: [...bucketLifecycleRules],
});
export const ProfileDeadLetters = Cloudflare.Queues.Queue("ProfileDeadLetters");
export const ProfileJobs = Cloudflare.Queues.Queue("ProfileJobs");

export const dataPlane = Effect.gen(function* () {
  const database = yield* ArtifactsDatabase;
  const artifacts = yield* ArtifactsBucket;
  const deadLetters = yield* ProfileDeadLetters;
  const profileJobs = yield* ProfileJobs;
  return { artifacts, database, deadLetters, profileJobs };
});

export type DataPlane = Effect.Success<typeof dataPlane>;
