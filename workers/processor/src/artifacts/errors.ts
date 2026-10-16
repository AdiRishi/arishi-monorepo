import { Schema } from "effect";

export class InvalidProfileJob extends Schema.TaggedError<InvalidProfileJob>()(
  "InvalidProfileJob",
  { cause: Schema.Defect() },
) {}

export class ProfileFailure extends Schema.TaggedError<ProfileFailure>()("ProfileFailure", {
  cause: Schema.Defect(),
  message: Schema.String,
}) {}

export class InvalidCsv extends Schema.TaggedError<InvalidCsv>()("InvalidCsv", {
  cause: Schema.Defect(),
  message: Schema.String,
}) {}
