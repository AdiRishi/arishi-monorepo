import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Effect from "effect/Effect";

import { deploymentConfig } from "./src/deployment-config.ts";
import { project } from "./src/project.ts";
import { webApplication } from "./src/web-application.ts";
import { workerGraph } from "./src/workers.ts";

export const Infrastructure = Effect.gen(function* () {
  const stack = yield* Alchemy.Stack;
  if (stack.stage === "placeholder") return {};

  const config = yield* deploymentConfig();
  const workers = yield* workerGraph(config);
  const web = yield* webApplication(config, workers);

  return { websiteUrl: web.url.as<string>() };
});

export default Alchemy.Stack(
  project.stackName,
  {
    providers: Cloudflare.providers(),
    state: Cloudflare.state(),
  },
  Infrastructure,
);
