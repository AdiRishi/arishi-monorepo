import type { ArtifactId } from "@repo/contracts/artifacts";
import { queryOptions } from "@tanstack/react-query";

import { getArtifact, listArtifacts } from "./functions";

export const artifactsQueryKey = ["artifacts", "list"] as const;

export const artifactsQueryOptions = () =>
  queryOptions({
    queryKey: artifactsQueryKey,
    queryFn: ({ signal }) => listArtifacts({ signal }),
    refetchInterval: (query) =>
      query.state.data?.some(
        (artifact) => artifact.status === "queued" || artifact.status === "processing",
      )
        ? 1_000
        : false,
    staleTime: 1_000,
  });

export const artifactQueryOptions = (artifactId: ArtifactId) =>
  queryOptions({
    queryKey: ["artifacts", "detail", artifactId] as const,
    queryFn: ({ signal }) => getArtifact({ data: { artifactId }, signal }),
    refetchInterval: (query) => {
      const artifact = query.state.data;
      return artifact?.status === "queued" || artifact?.status === "processing" ? 500 : false;
    },
    staleTime: 500,
  });
