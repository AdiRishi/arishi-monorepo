import { Schema } from "effect";

export const maxUploadBytes = 256 * 1024;
export const uploadLimitLabel = "256 KB";
export const ArtifactByteSize = Schema.Int.check(
  Schema.isBetween({ minimum: 1, maximum: maxUploadBytes }),
);
export const CsvUpload = Schema.File.check(
  Schema.isBetweenSize(1, maxUploadBytes, {
    message: "CSV files must be between 1 byte and 256 KB.",
  }),
  Schema.makeFilter(
    (file) => file.name.toLowerCase().endsWith(".csv") || "Only .csv files are accepted.",
  ),
);

export const ArtifactId = Schema.String.check(Schema.isUUID(4)).pipe(Schema.brand("ArtifactId"));
export type ArtifactId = typeof ArtifactId.Type;

export const Sha256 = Schema.String.check(Schema.isPattern(/^[a-f0-9]{64}$/u)).pipe(
  Schema.brand("Sha256"),
);
export type Sha256 = typeof Sha256.Type;

const columnFields = {
  name: Schema.String,
  emptyValues: Schema.Natural,
  nonEmptyValues: Schema.Natural,
};

export const ColumnProfile = Schema.Union([
  Schema.Struct({ ...columnFields, kind: Schema.Literal("empty") }),
  Schema.Struct({
    ...columnFields,
    kind: Schema.Literal("boolean"),
    falseValues: Schema.Natural,
    trueValues: Schema.Natural,
  }),
  Schema.Struct({
    ...columnFields,
    kind: Schema.Literal("number"),
    maximum: Schema.Finite,
    minimum: Schema.Finite,
  }),
  Schema.Struct({
    ...columnFields,
    kind: Schema.Literal("date"),
    maximum: Schema.String,
    minimum: Schema.String,
  }),
  Schema.Struct({ ...columnFields, kind: Schema.Literal("string") }),
]);
export type ColumnProfile = typeof ColumnProfile.Type;

export const CsvProfile = Schema.Struct({
  columns: Schema.Array(ColumnProfile),
  malformedRows: Schema.Natural,
  preview: Schema.Array(Schema.Array(Schema.String)),
  rowCount: Schema.Natural,
  sha256: Sha256,
});
export type CsvProfile = typeof CsvProfile.Type;

export const artifactFields = {
  byteSize: ArtifactByteSize,
  contentType: Schema.String,
  createdAt: Schema.String,
  fileName: Schema.String,
  id: ArtifactId,
};

export const ArtifactSummary = Schema.Union([
  Schema.Struct({ ...artifactFields, status: Schema.Literal("queued") }),
  Schema.Struct({ ...artifactFields, status: Schema.Literal("processing") }),
  Schema.Struct({
    ...artifactFields,
    completedAt: Schema.String,
    malformedRows: Schema.Natural,
    rowCount: Schema.Natural,
    status: Schema.Literal("complete"),
  }),
  Schema.Struct({
    ...artifactFields,
    completedAt: Schema.String,
    error: Schema.String,
    status: Schema.Literal("failed"),
  }),
]);
export type ArtifactSummary = typeof ArtifactSummary.Type;

export const QueuedProcessingState = Schema.Struct({ kind: Schema.Literal("queued") });
export type QueuedProcessingState = typeof QueuedProcessingState.Type;

export const ActiveProcessingState = Schema.Struct({
  kind: Schema.Literal("processing"),
  rowsProcessed: Schema.Natural,
  totalRows: Schema.Natural,
});
export type ActiveProcessingState = typeof ActiveProcessingState.Type;

export const ProcessingState = Schema.Union([QueuedProcessingState, ActiveProcessingState]);
export type ProcessingState = typeof ProcessingState.Type;

export const ArtifactDetail = Schema.Union([
  Schema.Struct({
    ...artifactFields,
    status: Schema.Literal("queued"),
  }),
  Schema.Struct({
    ...artifactFields,
    rowsProcessed: Schema.Natural,
    status: Schema.Literal("processing"),
    totalRows: Schema.Natural,
  }),
  Schema.Struct({
    ...artifactFields,
    completedAt: Schema.String,
    profile: CsvProfile,
    status: Schema.Literal("complete"),
  }),
  Schema.Struct({
    ...artifactFields,
    completedAt: Schema.String,
    error: Schema.String,
    status: Schema.Literal("failed"),
  }),
]);
export type ArtifactDetail = typeof ArtifactDetail.Type;

export const ListArtifactsResponse = Schema.Array(ArtifactSummary);
export type ListArtifactsResponse = typeof ListArtifactsResponse.Type;

export const ProfileJob = Schema.Struct({ artifactId: ArtifactId });
export type ProfileJob = typeof ProfileJob.Type;

export const ApiError = Schema.Struct({
  code: Schema.Literals(["invalid_request", "not_found", "storage_failure"]),
  message: Schema.String,
});
export type ApiError = typeof ApiError.Type;
