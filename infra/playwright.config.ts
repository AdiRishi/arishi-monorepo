import { defineConfig } from "@playwright/test";

const applicationUrl = process.env.APPLICATION_URL;
if (!applicationUrl) {
  throw new Error("Run pnpm test:integration so Alchemy supplies the application URL.");
}

export default defineConfig({
  testDir: "./tests/integration/journeys",
  workers: 1,
  timeout: 180_000,
  expect: { timeout: 90_000 },
  reporter: "list",
  use: {
    baseURL: new URL(applicationUrl).href,
    browserName: "chromium",
    headless: true,
    actionTimeout: 90_000,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
});
