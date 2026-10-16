import type { ArtifactNotFound } from "@repo/contracts/artifacts";
import { Schema } from "effect";

export class InvalidRequest extends Schema.TaggedError<InvalidRequest>()("InvalidRequest", {
  message: Schema.String,
}) {}

export class StorageFailure extends Schema.TaggedError<StorageFailure>()("StorageFailure", {
  cause: Schema.Defect(),
  operation: Schema.String,
}) {}

export type ApiFailure = InvalidRequest | ArtifactNotFound | StorageFailure;
