import {
  type ArtifactId,
  ArtifactNotFound,
  ArtifactsUnavailable,
  type CsvProfile,
  ProfilingRpcs,
} from "@repo/contracts/artifacts";
import { rpcWebHandler } from "@repo/contracts/server";
import { WorkerEntrypoint } from "cloudflare:workers";
import { Context, Effect } from "effect";
import type { Rpc, RpcGroup } from "effect/rpc";

/*
 * Stands in for the API Worker, which owns artifacts. The processor asks it
 * for an artifact's source and reports what profiling found. Tests store
 * sources, read the calls the processor made, or make an operation fail.
 */

type Operation = Rpc.Tag<RpcGroup.Rpcs<typeof ProfilingRpcs>>;

/** An operation the processor asked for, with the profile or failure message it reported. */
export interface ApiCall {
  readonly operation: Operation;
  readonly artifactId: ArtifactId;
  readonly detail?: CsvProfile | string;
}

interface Artifact {
  status: "queued" | "processing" | "complete" | "failed";
  readonly source: Uint8Array | null;
}

let artifacts = new Map<ArtifactId, Artifact>();
let calls: Array<ApiCall> = [];
let failing = new Set<Operation>();

export const storeArtifact = (artifactId: ArtifactId, source: string | null) => {
  artifacts.set(artifactId, {
    status: "queued",
    source: source === null ? null : new TextEncoder().encode(source),
  });
};

export const apiCalls = (): ReadonlyArray<ApiCall> => calls;

export const failApi = (operation: Operation, next: boolean) => {
  if (next) failing.add(operation);
  else failing.delete(operation);
};

export const resetApi = () => {
  artifacts = new Map();
  calls = [];
  failing = new Set();
};

const record = (operation: Operation, artifactId: ArtifactId, detail?: CsvProfile | string) =>
  Effect.suspend(() => {
    calls.push(
      detail === undefined ? { operation, artifactId } : { operation, artifactId, detail },
    );
    return failing.has(operation) ? Effect.fail(new ArtifactsUnavailable({})) : Effect.void;
  });

const rpc = rpcWebHandler(
  ProfilingRpcs,
  ProfilingRpcs.toLayer({
    startProfile: ({ artifactId }) =>
      record("startProfile", artifactId).pipe(
        Effect.map(() => {
          const artifact = artifacts.get(artifactId);
          if (
            artifact === undefined ||
            artifact.status === "complete" ||
            artifact.status === "failed"
          )
            return false;
          artifact.status = "processing";
          return true;
        }),
      ),
    getProfileSource: ({ artifactId }) =>
      record("getProfileSource", artifactId).pipe(
        Effect.flatMap(() => {
          const source = artifacts.get(artifactId)?.source;
          return source === undefined || source === null
            ? Effect.fail(new ArtifactNotFound({ artifactId }))
            : Effect.succeed(source);
        }),
      ),
    completeProfile: ({ artifactId, profile }) =>
      record("completeProfile", artifactId, profile).pipe(
        Effect.map(() => {
          const artifact = artifacts.get(artifactId);
          if (artifact?.status === "processing") artifact.status = "complete";
        }),
      ),
    failProfile: ({ artifactId, message }) =>
      record("failProfile", artifactId, message).pipe(
        Effect.map(() => {
          const artifact = artifacts.get(artifactId);
          if (artifact?.status === "processing" || artifact?.status === "queued")
            artifact.status = "failed";
        }),
      ),
  }),
);

export class ApiStandIn extends WorkerEntrypoint {
  override fetch(request: Request): Promise<Response> {
    return rpc.handler(request, Context.empty());
  }
}
