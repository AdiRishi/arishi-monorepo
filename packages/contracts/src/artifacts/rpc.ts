import { Schema } from "effect";
import { Rpc, RpcGroup } from "effect/rpc";

import { ArtifactNotFound, ArtifactsUnavailable, ProcessingUnavailable } from "./errors.ts";
import {
  ArtifactId,
  artifactFields,
  CsvProfile,
  ListArtifactsResponse,
  ProcessingState,
} from "./schema.ts";

/** An artifact as the API stores it. The processor knows how far profiling has got. */
export const StoredArtifact = Schema.Union([
  Schema.Struct({ ...artifactFields, status: Schema.Literal("queued") }),
  Schema.Struct({ ...artifactFields, status: Schema.Literal("processing") }),
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
export type StoredArtifact = typeof StoredArtifact.Type;

const artifactPayload = { artifactId: ArtifactId };

/** What the web app reads from the API. */
export class ArtifactsRpcs extends RpcGroup.make(
  Rpc.make("listArtifacts", { success: ListArtifactsResponse, error: ArtifactsUnavailable }),
  Rpc.make("getArtifact", {
    payload: artifactPayload,
    success: StoredArtifact,
    error: Schema.Union([ArtifactNotFound, ArtifactsUnavailable]),
  }),
) {}

/** What the processor asks of the API while it profiles an artifact. */
export class ProfilingRpcs extends RpcGroup.make(
  Rpc.make("startProfile", {
    payload: artifactPayload,
    success: Schema.Boolean,
    error: ArtifactsUnavailable,
  }),
  Rpc.make("getProfileSource", {
    payload: artifactPayload,
    success: Schema.Uint8ArrayFromBase64,
    error: Schema.Union([ArtifactNotFound, ArtifactsUnavailable]),
  }),
  Rpc.make("completeProfile", {
    payload: { artifactId: ArtifactId, profile: CsvProfile },
    error: ArtifactsUnavailable,
  }),
  Rpc.make("failProfile", {
    payload: { artifactId: ArtifactId, message: Schema.String },
    error: ArtifactsUnavailable,
  }),
) {}

/** What the web app reads from the processor about an artifact being profiled. */
export class ProcessingRpcs extends RpcGroup.make(
  Rpc.make("getProcessingState", {
    payload: artifactPayload,
    success: ProcessingState,
    error: ProcessingUnavailable,
  }),
) {}
