import { ApiError, ArtifactId } from "@repo/contracts/artifacts";
import { createFileRoute } from "@tanstack/react-router";
import { Result, Schema } from "effect";

import { fetchApi } from "@/server/api-client.server";

const decodeArtifactId = Schema.decodeUnknownResult(ArtifactId);

export const Route = createFileRoute("/artifacts/$artifactId/source")({
  server: {
    handlers: {
      GET: ({ params }) => {
        const artifactId = decodeArtifactId(params.artifactId);
        if (Result.isFailure(artifactId)) {
          return Response.json(
            {
              code: "invalid_request",
              message: "The artifact id is invalid.",
            } satisfies ApiError,
            { status: 400 },
          );
        }
        return fetchApi(`/api/artifacts/${encodeURIComponent(artifactId.success)}/source`);
      },
    },
  },
});
