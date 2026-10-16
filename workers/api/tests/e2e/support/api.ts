import {
  ArtifactId,
  ArtifactSummary,
  ArtifactsRpcs,
  CsvProfile,
  ProfileJob,
  ProfilingRpcs,
} from "@repo/contracts/artifacts";
import { clientOverBinding } from "@repo/contracts/client";
import { offeredMessages, queuedMessages } from "@repo/testing/queue";
import { env, exports } from "cloudflare:workers";
import { Effect, Schedule, Schema } from "effect";

/** The API as the web app reads it. */
export const artifactsApi = clientOverBinding(ArtifactsRpcs, {
  binding: exports.ArtifactsApi,
  service: "api",
  timeout: "5 seconds",
});

/** The API as the processor calls it while profiling. */
export const profilingApi = clientOverBinding(ProfilingRpcs, {
  binding: exports.ProfilingApi,
  service: "api",
  timeout: "5 seconds",
});

export const listArtifacts = () =>
  Effect.runPromise(
    Effect.scoped(Effect.flatMap(artifactsApi, (artifacts) => artifacts.listArtifacts())),
  );

export const csv = (contents: string, name = "transactions.csv") =>
  new File([contents], name, { type: "text/csv" });

/** A browser posting the upload form. */
export const postUpload = (file: File) => {
  const form = new FormData();
  form.set("file", file);
  return exports.default.fetch("https://api.test/api/artifacts", { method: "POST", body: form });
};

const decodeJob = Schema.decodeUnknownSync(ProfileJob);

/**
 * Waits for the profile job an upload sends after answering, so it cannot
 * land in a later test: the API recorded the send, or the queue refused it.
 */
const jobSettled = (artifactId: ArtifactId) =>
  Effect.gen(function* () {
    const dispatched = yield* Effect.promise(() =>
      env.DB.prepare("SELECT dispatched_at FROM artifacts WHERE id = ?")
        .bind(artifactId)
        .first<string | null>("dispatched_at"),
    );
    const refused = offeredMessages()
      .slice(queuedMessages().length)
      .some((message) => decodeJob(message).artifactId === artifactId);
    if (dispatched === null && !refused) return yield* Effect.fail("pending");
  }).pipe(Effect.retry({ schedule: Schedule.spaced("10 millis"), times: 200 }), Effect.orDie);

/** Uploads a CSV the API accepts, and returns what it recorded once its job has been sent. */
export const upload = (file: File) =>
  Effect.gen(function* () {
    const response = yield* Effect.promise(() => postUpload(file));
    if (response.status !== 202) {
      return yield* Effect.die(`The upload answered ${response.status}.`);
    }
    const artifact = yield* Schema.decodeUnknownEffect(ArtifactSummary)(
      yield* Effect.promise(() => response.json()),
    ).pipe(Effect.orDie);
    yield* jobSettled(artifact.id);
    return artifact;
  });

export const download = (artifactId: string) =>
  exports.default.fetch(`https://api.test/api/artifacts/${artifactId}/source`);

/** Runs the API's cron, which sends a profile job for every artifact not yet sent. */
export const dispatch = () => exports.default.scheduled({ cron: "* * * * *" });

/** The profile jobs sent to the processor's queue, oldest first. */
export const sentJobs = () => queuedMessages().map((message) => decodeJob(message));

/** A profile as the processor reports it for a CSV of `rowCount` amounts. */
export const profile = (rowCount: number) =>
  Schema.decodeSync(CsvProfile)({
    columns: [
      {
        name: "amount",
        kind: "number",
        emptyValues: 0,
        nonEmptyValues: rowCount,
        minimum: 1,
        maximum: 9,
      },
    ],
    malformedRows: 0,
    preview: [["amount"], ["1"]],
    rowCount,
    sha256: "a".repeat(64),
  });

export const unknownArtifact = ArtifactId.make("00000000-0000-4000-8000-000000000000");
