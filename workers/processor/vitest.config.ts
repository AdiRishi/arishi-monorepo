import type { ProcessorEnv } from "@repo/infra/worker-bindings";
import { durableObject, entrypoint, text, workerTest } from "@repo/testing/worker-config";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "unit",
          include: ["tests/**/*.test.ts"],
          exclude: ["tests/e2e/**"],
        },
      },
      {
        plugins: [
          workerTest<ProcessorEnv>({
            main: "./tests/e2e/worker.ts",
            bindings: {
              API: entrypoint("ApiStandIn"),
              DEAD_LETTER_QUEUE_NAME: text("profile-dead-letters"),
              PROFILE_SESSIONS: durableObject("CsvProfileSession"),
            },
          }),
        ],
        test: {
          name: "e2e",
          include: ["tests/e2e/**/*.test.ts"],
          setupFiles: ["./tests/e2e/setup.ts"],
        },
      },
    ],
  },
});
