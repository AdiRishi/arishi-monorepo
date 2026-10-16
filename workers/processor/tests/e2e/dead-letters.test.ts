import { expect, it } from "vitest";

import { apiCalls, storeArtifact } from "./support/api.ts";
import { acked, artifactId, deliverDeadLetter } from "./support/jobs.ts";

it("reports a job that exhausted its retries as a failure", async () => {
  storeArtifact(artifactId, null);

  expect(await deliverDeadLetter({ artifactId })).toEqual(acked("dead-letter"));
  expect(apiCalls()).toEqual([
    { operation: "failProfile", artifactId, detail: "CSV profiling exhausted its retries." },
  ]);
});
