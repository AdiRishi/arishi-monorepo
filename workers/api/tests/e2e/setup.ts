import { resetQueue } from "@repo/testing/queue";
import { applyD1Migrations, reset } from "cloudflare:test";
import { env } from "cloudflare:workers";
import { beforeEach } from "vitest";

beforeEach(async () => {
  await reset();
  resetQueue();
  await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
});
