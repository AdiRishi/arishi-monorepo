import {
  ArtifactByteSize,
  ArtifactId,
  ArtifactNotFound,
  CsvProfile,
} from "@repo/contracts/artifacts";
import { Context, DateTime, Effect, Layer, Schema } from "effect";
import { SqlClient, SqlSchema } from "effect/sql";

import { StorageFailure } from "./errors.ts";

const storedFields = {
  byte_size: ArtifactByteSize,
  content_type: Schema.String,
  created_at: Schema.String,
  file_name: Schema.String,
  id: ArtifactId,
  object_key: Schema.String,
};
const ArtifactRow = Schema.Union([
  Schema.Struct({
    ...storedFields,
    status: Schema.Literals(["queued", "processing"]),
    completed_at: Schema.Null,
    error_message: Schema.Null,
    profile_json: Schema.Null,
  }),
  Schema.Struct({
    ...storedFields,
    status: Schema.Literal("complete"),
    completed_at: Schema.String,
    error_message: Schema.Null,
    profile_json: Schema.fromJsonString(CsvProfile),
  }),
  Schema.Struct({
    ...storedFields,
    status: Schema.Literal("failed"),
    completed_at: Schema.String,
    error_message: Schema.String,
    profile_json: Schema.Null,
  }),
]);
const SourceArtifact = Schema.Struct({
  byte_size: ArtifactByteSize,
  file_name: Schema.String,
  object_key: Schema.String,
});

export type ArtifactRow = typeof ArtifactRow.Type;

export interface NewArtifactRecord {
  readonly byteSize: number;
  readonly contentType: string;
  readonly createdAt: string;
  readonly fileName: string;
  readonly id: ArtifactId;
  readonly objectKey: string;
}

export class ArtifactRepository extends Context.Service<
  ArtifactRepository,
  {
    readonly completeProfile: (options: {
      readonly artifactId: ArtifactId;
      readonly profile: CsvProfile;
    }) => Effect.Effect<void, StorageFailure>;
    readonly failProfile: (options: {
      readonly artifactId: ArtifactId;
      readonly message: string;
    }) => Effect.Effect<void, StorageFailure>;
    readonly startProfile: (artifactId: ArtifactId) => Effect.Effect<boolean, StorageFailure>;
    readonly getProfileSource: (
      artifactId: ArtifactId,
    ) => Effect.Effect<Uint8Array, ArtifactNotFound | StorageFailure>;
    readonly get: (
      artifactId: ArtifactId,
    ) => Effect.Effect<ArtifactRow, ArtifactNotFound | StorageFailure>;
    readonly insert: (artifact: NewArtifactRecord) => Effect.Effect<void, StorageFailure>;
    readonly pendingDelivery: Effect.Effect<
      ReadonlyArray<{ readonly id: ArtifactId }>,
      StorageFailure
    >;
    readonly markDispatched: (artifactId: ArtifactId) => Effect.Effect<void, StorageFailure>;
    readonly list: Effect.Effect<ReadonlyArray<ArtifactRow>, StorageFailure>;
    readonly readSource: (artifactId: ArtifactId) => Effect.Effect<
      {
        readonly object: R2ObjectBody;
        readonly row: typeof SourceArtifact.Type;
      },
      ArtifactNotFound | StorageFailure
    >;
    readonly storeSource: (
      artifact: NewArtifactRecord,
      file: File,
    ) => Effect.Effect<void, StorageFailure>;
  }
>()("Api/ArtifactRepository") {
  static readonly layer = (bucket: R2Bucket) =>
    Layer.effect(
      ArtifactRepository,
      Effect.gen(function* () {
        const sql = yield* SqlClient.SqlClient;
        const findArtifact = SqlSchema.findOne({
          Request: ArtifactId,
          Result: ArtifactRow,
          execute: (artifactId) => sql`
          SELECT id, file_name, object_key, content_type, byte_size, status,
                 created_at, completed_at, profile_json, error_message
          FROM artifacts WHERE id = ${artifactId}
        `,
        });
        const get = Effect.fn("ArtifactRepository.get")((artifactId: ArtifactId) =>
          findArtifact(artifactId).pipe(
            Effect.catchTags({
              NoSuchElementError: () => new ArtifactNotFound({ artifactId }),
              SchemaError: (cause) =>
                new StorageFailure({ cause, operation: "validate artifact record" }),
              SqlError: (cause) => new StorageFailure({ cause, operation: "get artifact" }),
            }),
          ),
        );

        const findSource = SqlSchema.findOne({
          Request: ArtifactId,
          Result: SourceArtifact,
          execute: (artifactId) => sql`
          SELECT file_name, object_key, byte_size FROM artifacts WHERE id = ${artifactId}
        `,
        });

        const readSource = Effect.fn("ArtifactRepository.readSource")(function* (
          artifactId: ArtifactId,
        ) {
          const row = yield* findSource(artifactId).pipe(
            Effect.catchTags({
              NoSuchElementError: () => new ArtifactNotFound({ artifactId }),
              SchemaError: (cause) =>
                new StorageFailure({ cause, operation: "validate source record" }),
              SqlError: (cause) => new StorageFailure({ cause, operation: "get artifact source" }),
            }),
          );
          const object = yield* Effect.tryPromise({
            try: () => bucket.get(row.object_key),
            catch: (cause) => new StorageFailure({ cause, operation: "read artifact source" }),
          });
          if (object === null) {
            return yield* new StorageFailure({
              cause: new Error(`Missing R2 object ${row.object_key}`),
              operation: "read artifact source",
            });
          }
          return { object, row };
        });
        return ArtifactRepository.of({
          getProfileSource: Effect.fn("ArtifactRepository.getProfileSource")(
            function* (artifactId) {
              const { object, row } = yield* readSource(artifactId);
              if (object.size !== row.byte_size) {
                return yield* new StorageFailure({
                  cause: new Error(`Expected ${row.byte_size} bytes, received ${object.size}`),
                  operation: "validate artifact source size",
                });
              }
              const buffer = yield* Effect.tryPromise({
                try: () => object.arrayBuffer(),
                catch: (cause) =>
                  new StorageFailure({ cause, operation: "buffer artifact source" }),
              });
              return new Uint8Array(buffer);
            },
          ),
          completeProfile: Effect.fn("ArtifactRepository.completeProfile")(function* ({
            artifactId,
            profile,
          }) {
            const encoded = yield* Schema.encodeEffect(Schema.fromJsonString(CsvProfile))(
              profile,
            ).pipe(
              Effect.mapError(
                (cause) =>
                  new StorageFailure({
                    cause,
                    operation: "encode profile result",
                  }),
              ),
            );
            yield* sql`
            UPDATE artifacts
            SET status = 'complete', completed_at = ${DateTime.formatIso(yield* DateTime.now)},
                profile_json = ${encoded}, error_message = NULL
            WHERE id = ${artifactId} AND status IN ('queued', 'processing')
          `.pipe(
              Effect.mapError(
                (cause) => new StorageFailure({ cause, operation: "store profile result" }),
              ),
            );
          }),
          failProfile: Effect.fn("ArtifactRepository.failProfile")(function* ({
            artifactId,
            message,
          }) {
            yield* sql`
            UPDATE artifacts
            SET status = 'failed', completed_at = ${DateTime.formatIso(yield* DateTime.now)},
                profile_json = NULL, error_message = ${message}
            WHERE id = ${artifactId} AND status IN ('queued', 'processing')
          `.pipe(
              Effect.mapError(
                (cause) =>
                  new StorageFailure({
                    cause,
                    operation: "store profile failure",
                  }),
              ),
            );
          }),
          startProfile: Effect.fn("ArtifactRepository.startProfile")(function* (artifactId) {
            const rows = yield* sql`
            UPDATE artifacts SET status = 'processing'
            WHERE id = ${artifactId} AND status IN ('queued', 'processing')
            RETURNING id
          `.pipe(
              Effect.mapError(
                (cause) =>
                  new StorageFailure({
                    cause,
                    operation: "start profile",
                  }),
              ),
            );
            return rows.length > 0;
          }),
          get,
          pendingDelivery: sql`
          SELECT id FROM artifacts
          WHERE dispatched_at IS NULL AND status = 'queued'
          ORDER BY created_at LIMIT 100
        `.pipe(
            Effect.flatMap(
              Schema.decodeUnknownEffect(Schema.Array(Schema.Struct({ id: ArtifactId }))),
            ),
            Effect.mapError(
              (cause) =>
                new StorageFailure({ cause, operation: "list pending profile deliveries" }),
            ),
          ),
          markDispatched: Effect.fn("ArtifactRepository.markDispatched")(function* (artifactId) {
            yield* sql`
            UPDATE artifacts SET dispatched_at = ${DateTime.formatIso(yield* DateTime.now)}
            WHERE id = ${artifactId} AND dispatched_at IS NULL
          `.pipe(
              Effect.mapError(
                (cause) => new StorageFailure({ cause, operation: "mark profile dispatched" }),
              ),
            );
          }),
          insert: Effect.fn("ArtifactRepository.insert")(function* (artifact) {
            yield* sql`
            INSERT INTO artifacts
              (id, file_name, object_key, content_type, byte_size, status, created_at)
            VALUES (${artifact.id}, ${artifact.fileName}, ${artifact.objectKey},
                    ${artifact.contentType}, ${artifact.byteSize}, 'queued', ${artifact.createdAt})
          `.pipe(
              Effect.mapError(
                (cause) => new StorageFailure({ cause, operation: "insert artifact" }),
              ),
            );
          }),
          list: sql`
          SELECT id, file_name, object_key, content_type, byte_size, status,
                 created_at, completed_at, profile_json, error_message
          FROM artifacts ORDER BY created_at DESC LIMIT 20
        `.pipe(
            Effect.flatMap(Schema.decodeUnknownEffect(Schema.Array(ArtifactRow))),
            Effect.mapError((cause) => new StorageFailure({ cause, operation: "list artifacts" })),
            Effect.withSpan("ArtifactRepository.list"),
          ),
          readSource,
          storeSource: Effect.fn("ArtifactRepository.storeSource")(function* (artifact, file) {
            yield* Effect.tryPromise({
              try: () =>
                bucket.put(artifact.objectKey, file.stream(), {
                  customMetadata: { artifactId: artifact.id, fileName: artifact.fileName },
                  httpMetadata: { contentType: artifact.contentType },
                }),
              catch: (cause) => new StorageFailure({ cause, operation: "store artifact source" }),
            });
          }),
        });
      }),
    );
}
