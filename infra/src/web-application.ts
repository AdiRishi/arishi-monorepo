import * as Cloudflare from "alchemy/Cloudflare";
import * as Effect from "effect/Effect";

import { workerCompatibility, workerObservability } from "./cloudflare-config.ts";
import type { DeploymentConfig } from "./deployment-config.ts";
import { websiteBindings } from "./worker-bindings.ts";
import type { Workers } from "./workers.ts";

export const webApplication = Effect.fn("ApplicationPlatform.WebApplication")(function* (
  config: DeploymentConfig,
  workers: Workers,
) {
  const web = yield* Cloudflare.Website.Vite("WebApplication", {
    rootDir: "../apps/web",
    main: "src/worker.ts",
    compatibility: workerCompatibility,
    workersDev: config.web.workersDev,
    domain: config.web.domain,
    observability: workerObservability,
    memo: {
      include: [
        "**/*",
        "../../packages/*/src/**",
        "../../packages/*/package.json",
        "../../tooling/tsconfig/**",
      ],
      lockfile: true,
    },
    env: websiteBindings(config.environment, workers.api),
  });

  return web;
});
