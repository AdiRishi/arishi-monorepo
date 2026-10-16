import * as Cloudflare from "alchemy/Cloudflare";

import type { DeploymentConfig } from "./deployment-config.ts";

/**
 * Each deployable's bindings, declared once. A Worker imports its `InferEnv`
 * type from this module.
 */

export const apiBindings = (environment: DeploymentConfig["environment"]) => ({
  ENVIRONMENT: environment,
});

export const websiteBindings = (
  environment: DeploymentConfig["environment"],
  api: Cloudflare.Worker,
) => ({
  API: Cloudflare.WorkerEntrypoint(api),
  ENVIRONMENT: environment,
});

export type ApiEnv = Cloudflare.InferEnv<ReturnType<typeof apiBindings>>;
export type WebsiteEnv = Cloudflare.InferEnv<ReturnType<typeof websiteBindings>>;
