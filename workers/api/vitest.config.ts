import type { ApiEnv } from "@repo/infra/worker-bindings";
import { text, workerTest } from "@repo/testing/worker-config";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    workerTest<ApiEnv>({
      main: "./tests/e2e/worker.ts",
      bindings: {
        ENVIRONMENT: text("test"),
      },
    }),
  ],
  test: {
    name: "e2e",
    include: ["tests/e2e/**/*.test.ts"],
  },
});
