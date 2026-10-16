import { exports } from "cloudflare:workers";
import { expect, it } from "vitest";

it("answers a route it does not serve with 404", async () => {
  const response = await exports.default.fetch("https://api.test/anything");

  expect({ status: response.status, body: await response.text() }).toEqual({
    status: 404,
    body: "Not found",
  });
});
