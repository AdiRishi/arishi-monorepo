import {
  ArtifactId,
  type ArtifactNotFound,
  type ArtifactSummary,
  type StoredArtifact,
} from "@repo/contracts/artifacts";
import { Context, Crypto, DateTime, Effect, Layer, Schema } from "effect";

import { StorageFailure } from "./errors.ts";
import { type ArtifactRow, ArtifactRepository } from "./repository.ts";

const decodeArtifactId = Schema.decodeEffect(ArtifactId);

const commonFields = (row: ArtifactRow) => ({
  byteSize: row.byte_size,
  contentType: row.content_type,
  createdAt: row.created_at,
  fileName: row.file_name,
  id: row.id,
});

const toSummary = (row: ArtifactRow): ArtifactSummary => {
  const common = commonFields(row);
  switch (row.status) {
    case "queued":
    case "processing":
      return { ...common, status: row.status };
    case "complete":
      return {
        ...common,
        completedAt: row.completed_at,
        malformedRows: row.profile_json.malformedRows,
        rowCount: row.profile_json.rowCount,
        status: "complete",
      };
    case "failed":
      return {
        ...common,
        completedAt: row.completed_at,
        error: row.error_message,
        status: "failed",
      };
  }
};

export class Artifacts extends Context.Service<
  Artifacts,
  {
    readonly create: (file: File) => Effect.Effect<ArtifactSummary, StorageFailure>;
    readonly get: (
      artifactId: ArtifactId,
    ) => Effect.Effect<StoredArtifact, ArtifactNotFound | StorageFailure>;
    readonly list: Effect.Effect<ReadonlyArray<ArtifactSummary>, StorageFailure>;
    readonly readSource: ArtifactRepository["Service"]["readSource"];
  }
>()("Api/Artifacts") {
  static readonly layer = Layer.effect(
    Artifacts,
    Effect.gen(function* () {
      const crypto = yield* Crypto.Crypto;
      const repository = yield* ArtifactRepository;

      const get = Effect.fn("Artifacts.get")(function* (artifactId: ArtifactId) {
        const row = yield* repository.get(artifactId);
        const common = commonFields(row);
        switch (row.status) {
          case "queued":
            return { ...common, status: "queued" } satisfies StoredArtifact;
          case "processing":
            return { ...common, status: "processing" } satisfies StoredArtifact;
          case "complete":
            return {
              ...common,
              completedAt: row.completed_at,
              profile: row.profile_json,
              status: "complete",
            } satisfies StoredArtifact;
          case "failed":
            return {
              ...common,
              completedAt: row.completed_at,
              error: row.error_message,
              status: "failed",
            } satisfies StoredArtifact;
        }
      });

      return Artifacts.of({
        create: Effect.fn("Artifacts.create")(function* (file) {
          const id = yield* crypto.randomUUIDv4.pipe(
            Effect.flatMap(decodeArtifactId),
            Effect.mapError(
              (cause) => new StorageFailure({ cause, operation: "generate artifact id" }),
            ),
          );
          const artifact = {
            byteSize: file.size,
            contentType: file.type.length > 0 ? file.type : "text/csv",
            createdAt: DateTime.formatIso(yield* DateTime.now),
            fileName: file.name,
            id,
            objectKey: `artifacts/${id}/source.csv`,
          };

          yield* repository.storeSource(artifact, file);
          yield* repository.insert(artifact);

          return {
            byteSize: artifact.byteSize,
            contentType: artifact.contentType,
            createdAt: artifact.createdAt,
            fileName: artifact.fileName,
            id,
            status: "queued",
          } satisfies ArtifactSummary;
        }),
        get,
        list: repository.list.pipe(
          Effect.map((rows) => rows.map(toSummary)),
          Effect.withSpan("Artifacts.list"),
        ),
        readSource: repository.readSource,
      });
    }),
  );
}
