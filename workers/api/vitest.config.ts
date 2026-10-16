import { resolve } from "node:path";

import type { ApiEnv } from "@repo/infra/worker-bindings";
import { d1, entrypoint, r2, text, workerTest } from "@repo/testing/worker-config";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    workerTest<ApiEnv>({
      main: "./tests/e2e/worker.ts",
      migrations: resolve(import.meta.dirname, "migrations"),
      bindings: {
        ARTIFACTS: r2,
        DB: d1,
        ENVIRONMENT: text("test"),
        PROFILE_JOBS: entrypoint("RecordedQueue"),
      },
    }),
  ],
  test: {
    name: "e2e",
    include: ["tests/e2e/**/*.test.ts"],
    setupFiles: ["./tests/e2e/setup.ts"],
  },
});
