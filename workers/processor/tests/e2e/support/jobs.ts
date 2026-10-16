import { ArtifactId, ProcessingRpcs } from "@repo/contracts/artifacts";
import { clientOverBinding } from "@repo/contracts/client";
import type { Encoded } from "@repo/testing/queue";
import { env, exports } from "cloudflare:workers";

export const artifactId = ArtifactId.make("11111111-1111-4111-8111-111111111111");

/** The processor as the web app asks it for progress. */
export const processingApi = clientOverBinding(ProcessingRpcs, {
  binding: exports.ProcessingApi,
  service: "processor",
  timeout: "5 seconds",
});

/** Cloudflare delivering a message from the profile jobs queue, on its `attempt`th delivery. */
export const deliver = (body: Encoded, attempt = 1) =>
  exports.default.queue("profile-jobs", [
    { id: `job-${attempt}`, timestamp: new Date(), attempts: attempt, body },
  ]);

/** Cloudflare delivering a job that exhausted its retries from the dead-letter queue. */
export const deliverDeadLetter = (body: Encoded) =>
  exports.default.queue(env.DEAD_LETTER_QUEUE_NAME, [
    { id: "dead-letter", timestamp: new Date(), attempts: 1, body },
  ]);

export const acked = (id: string) => ({
  outcome: "ok",
  ackAll: false,
  retryBatch: { retry: false },
  explicitAcks: [id],
  retryMessages: [],
});

export const retried = (id: string) => ({
  outcome: "ok",
  ackAll: false,
  retryBatch: { retry: false },
  explicitAcks: [],
  retryMessages: [{ msgId: id }],
});
