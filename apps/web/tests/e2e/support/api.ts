import {
  ArtifactNotFound,
  ArtifactsRpcs,
  type ArtifactSummary,
  type StoredArtifact,
} from "@repo/contracts/artifacts";
import { rpcWebHandler } from "@repo/contracts/server";
import { WorkerEntrypoint } from "cloudflare:workers";
import { Context, Effect } from "effect";

/*
 * Stands in for the API Worker. The web Worker reads artifacts from it over
 * RPC and forwards uploads and downloads to its routes. Tests store the
 * artifacts it lists and read the requests its routes received.
 */

let artifacts: ReadonlyArray<StoredArtifact> = [];
let received: Array<{ readonly method: string; readonly path: string }> = [];

/** Replaces the artifacts the API holds, newest first. */
export const storeArtifacts = (next: ReadonlyArray<StoredArtifact>) => {
  artifacts = next;
};

export const receivedRequests = () => received;

export const resetApi = () => {
  artifacts = [];
  received = [];
};

const summary = (artifact: StoredArtifact): ArtifactSummary => {
  switch (artifact.status) {
    case "complete": {
      const { profile, ...rest } = artifact;
      return { ...rest, malformedRows: profile.malformedRows, rowCount: profile.rowCount };
    }
    case "queued":
    case "processing":
    case "failed":
      return artifact;
  }
};

const artifactsRpc = rpcWebHandler(
  ArtifactsRpcs,
  ArtifactsRpcs.toLayer({
    listArtifacts: () => Effect.sync(() => artifacts.map(summary)),
    getArtifact: ({ artifactId }) =>
      Effect.suspend(() => {
        const artifact = artifacts.find(({ id }) => id === artifactId);
        return artifact === undefined
          ? Effect.fail(new ArtifactNotFound({ artifactId }))
          : Effect.succeed(artifact);
      }),
  }),
);

export class ApiStandIn extends WorkerEntrypoint {
  override fetch(request: Request): Response {
    received.push({ method: request.method, path: new URL(request.url).pathname });
    return request.method === "POST"
      ? Response.json({ accepted: true }, { status: 202 })
      : new Response("date,amount\n", { headers: { "content-type": "text/csv" } });
  }
}

export class ArtifactsStandIn extends WorkerEntrypoint {
  override fetch(request: Request): Promise<Response> {
    return artifactsRpc.handler(request, Context.empty());
  }
}
