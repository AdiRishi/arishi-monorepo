import { expect, test } from "vitest";

import { AppRequestError, appRequestErrorSerialization } from "../src/app.ts";

test("browser error serialization preserves recovery codes without server diagnostics", () => {
  const error = Object.assign(new AppRequestError("unavailable", "Try again."), {
    cause: new Error("Private database details"),
    diagnostics: "private",
  });
  const wire = appRequestErrorSerialization.toSerializable(error);
  expect(wire).toEqual({ code: "unavailable", message: "Try again." });
  const restored = appRequestErrorSerialization.fromSerializable(wire);
  expect(restored).toEqual(new AppRequestError("unavailable", "Try again."));
  expect(restored).not.toHaveProperty("stack");
  expect(restored).not.toHaveProperty("cause");
});
