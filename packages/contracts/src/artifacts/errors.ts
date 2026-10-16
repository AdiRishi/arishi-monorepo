import { Schema } from "effect";

import { ArtifactId } from "./schema.ts";

export class ArtifactNotFound extends Schema.TaggedError<ArtifactNotFound>()("ArtifactNotFound", {
  artifactId: ArtifactId,
}) {}

export class ArtifactsUnavailable extends Schema.TaggedError<ArtifactsUnavailable>()(
  "ArtifactsUnavailable",
  {},
) {}

export class ProcessingUnavailable extends Schema.TaggedError<ProcessingUnavailable>()(
  "ProcessingUnavailable",
  {},
) {}
