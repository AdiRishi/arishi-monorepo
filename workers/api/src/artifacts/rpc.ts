import { ArtifactsRpcs, ArtifactsUnavailable, ProfilingRpcs } from "@repo/contracts/artifacts";
import { rpcWebHandler } from "@repo/contracts/server";
import { Effect } from "effect";

import type { StorageFailure } from "./errors.ts";
import { ArtifactRepository } from "./repository.ts";
import { Artifacts } from "./service.ts";

const unavailable = (failure: StorageFailure) =>
  Effect.logError("Artifact request failed", failure.cause).pipe(
    Effect.annotateLogs({ operation: failure.operation }),
    Effect.andThen(Effect.fail(new ArtifactsUnavailable({}))),
  );

export const artifactsRpc = rpcWebHandler(
  ArtifactsRpcs,
  ArtifactsRpcs.toLayer({
    listArtifacts: () =>
      Artifacts.use((artifacts) => artifacts.list).pipe(
        Effect.catchTag("StorageFailure", unavailable),
      ),
    getArtifact: ({ artifactId }) =>
      Artifacts.use((artifacts) => artifacts.get(artifactId)).pipe(
        Effect.catchTag("StorageFailure", unavailable),
      ),
  }),
);

export const profilingRpc = rpcWebHandler(
  ProfilingRpcs,
  ProfilingRpcs.toLayer({
    startProfile: ({ artifactId }) =>
      ArtifactRepository.use((repository) => repository.startProfile(artifactId)).pipe(
        Effect.catchTag("StorageFailure", unavailable),
      ),
    getProfileSource: ({ artifactId }) =>
      ArtifactRepository.use((repository) => repository.getProfileSource(artifactId)).pipe(
        Effect.catchTag("StorageFailure", unavailable),
      ),
    completeProfile: (options) =>
      ArtifactRepository.use((repository) => repository.completeProfile(options)).pipe(
        Effect.catchTag("StorageFailure", unavailable),
      ),
    failProfile: (options) =>
      ArtifactRepository.use((repository) => repository.failProfile(options)).pipe(
        Effect.catchTag("StorageFailure", unavailable),
      ),
  }),
);
