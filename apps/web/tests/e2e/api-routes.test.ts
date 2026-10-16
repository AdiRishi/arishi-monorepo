import { exports } from "cloudflare:workers";
import { expect, it } from "vitest";

import { receivedRequests } from "./support/api.ts";

const artifactId = "28f31da1-a2ed-4f1f-a9d9-463107ad09f0";

it("forwards an upload to the API and answers with the API's response", async () => {
  const form = new FormData();
  form.set("file", new File(["a\n1\n"], "a.csv", { type: "text/csv" }));

  const response = await exports.default.fetch("https://web.test/api/artifacts", {
    method: "POST",
    headers: { origin: "https://web.test", "sec-fetch-site": "same-origin" },
    body: form,
  });

  expect({ status: response.status, body: await response.json() }).toEqual({
    status: 202,
    body: { accepted: true },
  });
  expect(receivedRequests()).toEqual([{ method: "POST", path: "/api/artifacts" }]);
});

it("serves an artifact's source from the API", async () => {
  const response = await exports.default.fetch(`https://web.test/artifacts/${artifactId}/source`);

  expect({ status: response.status, body: await response.text() }).toEqual({
    status: 200,
    body: "date,amount\n",
  });
  expect(receivedRequests()).toEqual([
    { method: "GET", path: `/api/artifacts/${artifactId}/source` },
  ]);
});

it("refuses a malformed artifact id without asking the API", async () => {
  const response = await exports.default.fetch("https://web.test/artifacts/invalid/source");

  expect({ status: response.status, body: await response.json() }).toEqual({
    status: 400,
    body: { code: "invalid_request", message: "The artifact id is invalid." },
  });
  expect(receivedRequests()).toEqual([]);
});
