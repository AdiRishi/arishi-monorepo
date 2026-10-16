import {
  ApiError,
  ArtifactId,
  type ArtifactSummary,
  maxUploadBytes,
  CsvUpload,
} from "@repo/contracts/artifacts";
import { Effect, Layer, Schema, Stream } from "effect";
import { HttpRouter, HttpServerRequest, HttpServerResponse } from "effect/http";

import { apiRequest } from "../platform/worker-request.ts";
import { dispatchProfiles } from "./dispatch.ts";
import { type ApiFailure, InvalidRequest } from "./errors.ts";
import { Artifacts } from "./service.ts";

const errorResponse = (failure: ApiFailure): HttpServerResponse.HttpServerResponse => {
  if (failure._tag === "InvalidRequest") {
    return HttpServerResponse.jsonUnsafe(
      { code: "invalid_request", message: failure.message } satisfies ApiError,
      {
        status: 400,
      },
    );
  }
  if (failure._tag === "ArtifactNotFound") {
    return HttpServerResponse.jsonUnsafe(
      { code: "not_found", message: "Artifact not found." } satisfies ApiError,
      {
        status: 404,
      },
    );
  }
  return HttpServerResponse.jsonUnsafe(
    {
      code: "storage_failure",
      message: "The platform could not complete the request.",
    } satisfies ApiError,
    { status: 500 },
  );
};

const handleFailure = (failure: ApiFailure) =>
  failure._tag === "StorageFailure"
    ? Effect.logError("API storage operation failed", failure.cause).pipe(
        Effect.annotateLogs({ operation: failure.operation }),
        Effect.as(errorResponse(failure)),
      )
    : Effect.succeed(errorResponse(failure));

const readUpload = Effect.fn("Api.readUpload")(function* (
  request: HttpServerRequest.HttpServerRequest,
) {
  const invalidUpload = () =>
    new InvalidRequest({ message: "Choose a CSV file of 256 KB or smaller." });
  const maxRequestBytes = maxUploadBytes + 16 * 1024;
  if (Number(request.headers["content-length"]) > maxRequestBytes) {
    return yield* invalidUpload();
  }
  let size = 0;
  const chunks = yield* request.stream.pipe(
    Stream.mapError(invalidUpload),
    Stream.mapEffect((chunk) => {
      size += chunk.byteLength;
      return size > maxRequestBytes
        ? Effect.fail(invalidUpload())
        : Effect.succeed(new Uint8Array(chunk));
    }),
    Stream.runCollect,
  );
  const form = yield* Effect.tryPromise({
    try: () => new Response(new Blob(chunks), { headers: request.headers }).formData(),
    catch: invalidUpload,
  });
  const entry = yield* Schema.decodeUnknownEffect(CsvUpload)(form.get("file")).pipe(
    Effect.mapError(
      () => new InvalidRequest({ message: "Choose a non-empty .csv file of 256 KB or smaller." }),
    ),
  );
  return entry;
});

const upload = Effect.fn("Api.upload")(function* (request: HttpServerRequest.HttpServerRequest) {
  const file = yield* readUpload(request);
  const artifact = yield* Artifacts.use((artifacts) => artifacts.create(file));
  const { env, executionContext } = yield* apiRequest.service;
  executionContext.waitUntil(dispatchProfiles(env));
  return HttpServerResponse.jsonUnsafe(artifact satisfies ArtifactSummary, { status: 202 });
}, Effect.catch(handleFailure));

const download = Effect.gen(function* () {
  const { artifactId } = yield* HttpRouter.schemaPathParams(
    Schema.Struct({ artifactId: ArtifactId }),
  ).pipe(Effect.mapError(() => new InvalidRequest({ message: "The artifact id is invalid." })));
  const { object, row } = yield* Artifacts.use((artifacts) => artifacts.readSource(artifactId));
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("content-disposition", `attachment; filename=${JSON.stringify(row.file_name)}`);
  headers.set("etag", object.httpEtag);
  return HttpServerResponse.raw(object.body, { headers });
}).pipe(Effect.catch(handleFailure));

const health = Effect.map(apiRequest.service, ({ env }) =>
  HttpServerResponse.jsonUnsafe({ environment: env.ENVIRONMENT, service: "api" }),
);

export const artifactHttpRoutes = Layer.mergeAll(
  HttpRouter.add("GET", "/health", health),
  HttpRouter.add("POST", "/api/artifacts", upload),
  HttpRouter.add("GET", "/api/artifacts/:artifactId/source", download),
  HttpRouter.add(
    "*",
    "/*",
    HttpServerResponse.jsonUnsafe(
      { code: "not_found", message: "Route not found." } satisfies ApiError,
      { status: 404 },
    ),
  ),
);
