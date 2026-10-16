import { expect, it } from "@effect/vitest";
import {
  ActiveProcessingState,
  ArtifactByteSize,
  ArtifactDetail,
  ColumnProfile,
  CsvProfile,
  CsvUpload,
  maxUploadBytes,
  ProfileJob,
} from "@repo/contracts/artifacts";
import { Effect, Schema } from "effect";

it.effect("queue jobs reject identifiers outside the shared contract", () =>
  Effect.gen(function* () {
    const failure = yield* Effect.flip(
      Schema.decodeEffect(ProfileJob)({ artifactId: "not-a-uuid" }),
    );

    expect(failure.message).toMatch(/UUID/);
  }),
);

it.effect("a completed artifact requires its profile", () =>
  Effect.gen(function* () {
    const failure = yield* Effect.flip(
      Schema.decodeUnknownEffect(ArtifactDetail)({
        byteSize: 12,
        completedAt: "2026-08-22T00:00:00.000Z",
        contentType: "text/csv",
        createdAt: "2026-08-22T00:00:00.000Z",
        fileName: "sample.csv",
        id: "28f31da1-a2ed-4f1f-a9d9-463107ad09f0",
        status: "complete",
      }),
    );

    expect(failure.message).toMatch(/profile/);
  }),
);

it.each([NaN, Infinity, -Infinity])(
  "numeric column profiles reject non-finite extrema: %s",
  (value) => {
    const column = {
      name: "amount",
      kind: "number",
      emptyValues: 0,
      nonEmptyValues: 1,
      minimum: 0,
      maximum: 1,
    };
    expect(Schema.is(ColumnProfile)({ ...column, minimum: value })).toBe(false);
    expect(Schema.is(ColumnProfile)({ ...column, maximum: value })).toBe(false);
  },
);

it.each([-1, 0.5])("profile and progress counts reject invalid counts: %s", (value) => {
  expect(
    Schema.is(CsvProfile)({
      columns: [],
      malformedRows: 0,
      preview: [],
      rowCount: value,
      sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    }),
  ).toBe(false);
  expect(
    Schema.is(ActiveProcessingState)({
      kind: "processing",
      rowsProcessed: value,
      totalRows: 10,
    }),
  ).toBe(false);
});

it.each([0, maxUploadBytes + 1])("artifact byte sizes reject unsupported sizes: %s", (size) => {
  expect(Schema.is(ArtifactByteSize)(size)).toBe(false);
  expect(() => Schema.decodeSync(CsvUpload)(new File([new Uint8Array(size)], "data.csv"))).toThrow(
    "CSV files must be between 1 byte and 256 KB.",
  );
});

it.each([1, maxUploadBytes])("artifact byte sizes accept boundary sizes: %s", (size) => {
  expect(Schema.is(ArtifactByteSize)(size)).toBe(true);
  expect(Schema.is(CsvUpload)(new File([new Uint8Array(size)], "data.csv"))).toBe(true);
});
