import type { WebsiteEnv } from "@repo/infra/worker-bindings";
import { text, unreachable, workerTest } from "@repo/testing/worker-config";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    projects: [
      {
        test: {
          name: "unit",
          environment: "node",
          include: ["tests/**/*.test.ts"],
          exclude: ["tests/e2e/**"],
        },
      },
      {
        plugins: [tailwindcss(), viteReact()],
        test: {
          name: "browser",
          include: ["tests/**/*.test.tsx"],
          setupFiles: ["./tests/setup.ts"],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: "chromium" }],
          },
        },
      },
      {
        plugins: [
          workerTest<WebsiteEnv>({
            main: "./tests/e2e/worker.ts",
            bindings: {
              API: unreachable,
              ENVIRONMENT: text("test"),
            },
          }),
        ],
        test: {
          name: "e2e",
          include: ["tests/e2e/**/*.test.ts"],
          // A file's first request loads the built Worker, which takes several
          // seconds while other suites run beside it.
          testTimeout: 60_000,
        },
      },
    ],
  },
});
