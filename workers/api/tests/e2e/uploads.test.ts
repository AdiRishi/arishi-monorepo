import { expect, it } from "@effect/vitest";
import { maxUploadBytes } from "@repo/contracts/artifacts";
import { exports } from "cloudflare:workers";
import { Effect } from "effect";

import {
  artifactsApi,
  csv,
  download,
  listArtifacts,
  postUpload,
  unknownArtifact,
  upload,
} from "./support/api.ts";

const source = "date,description,amount\n2026-08-01,Coffee,-4.80\n";

it.live("stores an uploaded CSV, queues it, and serves it back unchanged", () =>
  Effect.gen(function* () {
    const artifact = yield* upload(csv(source));

    expect(artifact).toEqual({
      id: artifact.id,
      fileName: "transactions.csv",
      contentType: "text/csv",
      byteSize: 48,
      createdAt: artifact.createdAt,
      status: "queued",
    });
    const response = yield* Effect.promise(() => download(artifact.id));
    expect({
      status: response.status,
      disposition: response.headers.get("content-disposition"),
      type: response.headers.get("content-type"),
      body: yield* Effect.promise(() => response.text()),
    }).toEqual({
      status: 200,
      disposition: 'attachment; filename="transactions.csv"',
      type: "text/csv",
      body: source,
    });
  }),
);

it.live("keeps a file name with quotes intact through storage and download", () =>
  Effect.gen(function* () {
    const api = yield* artifactsApi;
    const artifact = yield* upload(csv(source, "Adi's 'March' report.csv"));

    expect((yield* api.getArtifact({ artifactId: artifact.id })).fileName).toBe(
      "Adi's 'March' report.csv",
    );
    const response = yield* Effect.promise(() => download(artifact.id));
    yield* Effect.promise(() => response.text());
    expect(response.headers.get("content-disposition")).toBe(
      `attachment; filename="Adi's 'March' report.csv"`,
    );
  }),
);

it.each([
  ["a file that is not a CSV", csv(source, "transactions.txt")],
  ["an empty CSV", csv("")],
  ["a CSV over the size limit", csv("x".repeat(maxUploadBytes + 1))],
])("refuses %s and stores nothing", async (_, file) => {
  const response = await postUpload(file);

  expect({ status: response.status, body: await response.json() }).toEqual({
    status: 400,
    body: { code: "invalid_request", message: expect.any(String) },
  });
  expect(await listArtifacts()).toEqual([]);
});

it("refuses an upload that declares no length once it passes the limit", async () => {
  const oversized = new TextEncoder().encode("x".repeat(maxUploadBytes + 64 * 1024));
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(oversized);
      controller.close();
    },
  });

  const response = await exports.default.fetch("https://api.test/api/artifacts", {
    method: "POST",
    headers: { "content-type": "multipart/form-data; boundary=x" },
    body,
  });

  expect(response.status).toBe(400);
  expect(await listArtifacts()).toEqual([]);
});

it("answers not found for an unknown artifact and invalid request for a malformed id", async () => {
  const unknown = await download(unknownArtifact);
  const malformed = await download("not-an-id");

  expect([
    { status: unknown.status, body: await unknown.json() },
    { status: malformed.status, body: await malformed.json() },
  ]).toEqual([
    { status: 404, body: { code: "not_found", message: "Artifact not found." } },
    { status: 400, body: { code: "invalid_request", message: "The artifact id is invalid." } },
  ]);
});
