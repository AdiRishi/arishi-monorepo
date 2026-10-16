import { expect, it } from "vitest";

import { apiCalls, failApi, storeArtifact } from "./support/api.ts";
import { acked, artifactId, deliver, retried } from "./support/jobs.ts";

const source = "amount\n1\n2\n";

const profile = {
  columns: [
    { name: "amount", kind: "number", emptyValues: 0, nonEmptyValues: 2, minimum: 1, maximum: 2 },
  ],
  malformedRows: 0,
  preview: [["1"], ["2"]],
  rowCount: 2,
  sha256: "9a5ffb848602b56f742d1cf638ba587ad19c7dac9024f8670a09a001a4139f87",
};

it("profiles a queued CSV and reports the result to the API", async () => {
  storeArtifact(artifactId, source);

  expect(await deliver({ artifactId })).toEqual(acked("job-1"));
  expect(apiCalls()).toEqual([
    { operation: "startProfile", artifactId },
    { operation: "getProfileSource", artifactId },
    { operation: "completeProfile", artifactId, detail: profile },
  ]);
});

it("reports a CSV it cannot parse as a failure, without retrying", async () => {
  storeArtifact(artifactId, 'name\n"unterminated');

  expect(await deliver({ artifactId })).toEqual(acked("job-1"));
  expect(apiCalls().at(-1)).toEqual({
    operation: "failProfile",
    artifactId,
    detail: "The CSV could not be profiled.",
  });
});

it("leaves an artifact the API has already finished alone", async () => {
  storeArtifact(artifactId, source);
  await deliver({ artifactId });

  expect(await deliver({ artifactId }, 2)).toEqual(acked("job-2"));
  expect(apiCalls().slice(3)).toEqual([{ operation: "startProfile", artifactId }]);
});

it.each(["getProfileSource", "completeProfile"] as const)(
  "retries the job while the API fails %s, and completes it on redelivery",
  async (operation) => {
    storeArtifact(artifactId, source);
    failApi(operation, true);

    expect(await deliver({ artifactId })).toEqual(retried("job-1"));

    failApi(operation, false);
    expect(await deliver({ artifactId }, 2)).toEqual(acked("job-2"));
    expect(apiCalls().at(-1)).toEqual({
      operation: "completeProfile",
      artifactId,
      detail: profile,
    });
  },
);

it("discards a message that is not a profile job", async () => {
  expect(await deliver({ artifact: "nonsense" })).toEqual(acked("job-1"));
  expect(apiCalls()).toEqual([]);
});
