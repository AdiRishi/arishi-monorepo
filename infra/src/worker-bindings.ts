import * as Cloudflare from "alchemy/Cloudflare";

import type { CsvProfileSession } from "../../workers/processor/src/index.ts";
import type { DataPlane } from "./data-plane.ts";
import type { DeploymentConfig } from "./deployment-config.ts";

/**
 * Each deployable's bindings, declared once. A Worker imports its `InferEnv`
 * type from this module.
 */

export const apiBindings = (data: DataPlane, environment: DeploymentConfig["environment"]) => ({
  ARTIFACTS: data.artifacts,
  DB: data.database,
  ENVIRONMENT: environment,
  PROFILE_JOBS: data.profileJobs,
});

export const processorBindings = (data: DataPlane, api: Cloudflare.Worker) => ({
  API: Cloudflare.WorkerEntrypoint(api, "ProfilingApi"),
  DEAD_LETTER_QUEUE_NAME: data.deadLetters.queueName,
  // A Durable Object's data is keyed by its binding name here. Renaming one
  // deletes the class and everything it stored.
  PROFILE_SESSIONS: Cloudflare.DurableObject<CsvProfileSession>("CsvProfileSession"),
});

export const websiteBindings = (
  environment: DeploymentConfig["environment"],
  api: Cloudflare.Worker,
  processor: Cloudflare.Worker,
) => ({
  API: Cloudflare.WorkerEntrypoint(api),
  ARTIFACTS: Cloudflare.WorkerEntrypoint(api, "ArtifactsApi"),
  ENVIRONMENT: environment,
  PROCESSING: Cloudflare.WorkerEntrypoint(processor, "ProcessingApi"),
});

export type ApiEnv = Cloudflare.InferEnv<ReturnType<typeof apiBindings>>;
export type ProcessorEnv = Cloudflare.InferEnv<ReturnType<typeof processorBindings>>;
export type WebsiteEnv = Cloudflare.InferEnv<ReturnType<typeof websiteBindings>>;
