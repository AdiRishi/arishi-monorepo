import { StoredArtifact } from "@repo/contracts/artifacts";
import { exports } from "cloudflare:workers";
import { Schema } from "effect";
import { expect, it } from "vitest";

import { storeArtifacts } from "./support/api.ts";
import { reportProgress, takeProcessorDown } from "./support/processor.ts";

const page = async () => {
  const response = await exports.default.fetch("https://web.test/");
  return { status: response.status, html: await response.text() };
};

it("renders an empty library before anything is uploaded", async () => {
  const { status, html } = await page();

  expect(status).toBe(200);
  expect(html).toContain("No profiles yet");
});

it("renders the newest profile the API lists", async () => {
  storeArtifacts([
    Schema.decodeSync(StoredArtifact)({
      byteSize: 42,
      completedAt: "2026-08-22T00:00:01.000Z",
      contentType: "text/csv",
      createdAt: "2026-08-22T00:00:00.000Z",
      fileName: "march-statement.csv",
      id: "28f31da1-a2ed-4f1f-a9d9-463107ad09f0",
      profile: {
        columns: [
          {
            emptyValues: 0,
            kind: "number",
            maximum: 42,
            minimum: -4,
            name: "amount",
            nonEmptyValues: 2,
          },
        ],
        malformedRows: 0,
        preview: [["-4"], ["42"]],
        rowCount: 2,
        sha256: "a".repeat(64),
      },
      status: "complete",
    }),
  ]);

  const { status, html } = await page();

  expect(status).toBe(200);
  expect(html).toContain("march-statement.csv");
  expect(html).toContain("Column profile");
});

const processing = Schema.decodeSync(StoredArtifact)({
  byteSize: 9,
  contentType: "text/csv",
  createdAt: "2026-08-22T00:00:00.000Z",
  fileName: "april-statement.csv",
  id: "6b1f1c4e-5d0a-4d6e-9c55-1f1d6f0b8a21",
  status: "processing",
});

it("renders how far the processor has profiled the newest artifact", async () => {
  storeArtifacts([processing]);
  reportProgress(processing.id, { kind: "processing", rowsProcessed: 1, totalRows: 4 });

  const { status, html } = await page();

  expect(status).toBe(200);
  expect(html).toContain("Profiling");
  expect(html).toContain("25%");
});

it("renders the unavailable error page while the processor is down", async () => {
  storeArtifacts([processing]);
  takeProcessorDown();

  const { html } = await page();

  expect(html).toContain("The service is temporarily unavailable. Please try again.");
});
