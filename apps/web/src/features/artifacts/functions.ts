import { AppRequestError } from "@repo/contracts/app";
import { ArtifactId, type ArtifactDetail } from "@repo/contracts/artifacts";
import { createServerFn } from "@tanstack/react-start";
import { Effect, Schema } from "effect";

import { callApiRpc } from "@/server/api-client.server";

import { artifactRequestErrors } from "./errors";

const decodeArtifactInput = Schema.decodeUnknownResult(Schema.Struct({ artifactId: ArtifactId }));

export const listArtifacts = createServerFn({ method: "GET" }).handler(() =>
  callApiRpc(({ artifacts }) =>
    artifacts
      .listArtifacts()
      .pipe(Effect.catchTag("ArtifactsUnavailable", artifactRequestErrors.ArtifactsUnavailable)),
  ),
);

export const getArtifact = createServerFn({ method: "GET" })
  .validator((input: { readonly artifactId: string }) => {
    const decoded = decodeArtifactInput(input);
    if (decoded._tag === "Failure")
      throw new AppRequestError("invalid_request", "The artifact id is invalid.");
    return decoded.success;
  })
  .handler(({ data }) =>
    callApiRpc(({ artifacts, processing }) =>
      Effect.gen(function* () {
        const artifact = yield* artifacts.getArtifact(data);
        if (artifact.status !== "processing") return artifact satisfies ArtifactDetail;
        const state = yield* processing.getProcessingState(data);
        return {
          ...artifact,
          rowsProcessed: state.kind === "processing" ? state.rowsProcessed : 0,
          totalRows: state.kind === "processing" ? state.totalRows : 0,
        } satisfies ArtifactDetail;
      }).pipe(Effect.catchTags(artifactRequestErrors)),
    ),
  );
