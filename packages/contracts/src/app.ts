import { Schema } from "effect";

const AppErrorCode = Schema.Literals(["invalid_request", "not_found", "unavailable", "internal"]);
const SerializedAppRequestError = Schema.Struct({ code: AppErrorCode, message: Schema.String });

export class AppRequestError extends Error {
  readonly code: typeof AppErrorCode.Type;

  constructor(code: typeof AppErrorCode.Type, message: string) {
    super(message);
    this.name = "AppRequestError";
    this.code = code;
    delete this.stack;
  }
}

export const appRequestErrorSerialization = {
  key: "AppRequestError",
  test: Schema.is(Schema.instanceOf(AppRequestError)),
  toSerializable: (error: AppRequestError) => ({ code: error.code, message: error.message }),
  fromSerializable: (value: typeof SerializedAppRequestError.Type) => {
    const decoded = Schema.decodeSync(SerializedAppRequestError)(value);
    return new AppRequestError(decoded.code, decoded.message);
  },
};
