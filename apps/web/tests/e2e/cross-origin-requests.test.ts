import { exports } from "cloudflare:workers";
import { expect, it } from "vitest";

it.each([
  ["cross-site fetch metadata", { "sec-fetch-site": "cross-site" }],
  ["a foreign origin", { origin: "https://other.test" }],
  ["no origin evidence", {}],
])("refuses a server-function call with %s", async (_, headers: Record<string, string>) => {
  const response = await exports.default.fetch("https://web.test/_serverFn/any", { headers });

  expect({ status: response.status, body: await response.text() }).toEqual({
    status: 403,
    body: "Forbidden",
  });
});
