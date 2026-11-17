import * as Cloudflare from "@alchemy.run/cloudflare";
import * as GitHub from "@alchemy.run/github";
import * as Alchemy from "alchemy";
import * as Output from "alchemy/Output";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

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

  const github = yield* GitHub.GitHubEnv;
  if (config.environment === "preview" && github?.pr !== undefined) {
    yield* GitHub.Comment("PreviewComment", {
      owner: github.owner,
      repository: github.repository,
      issueNumber: github.pr,
      body: Output.interpolate`
        **Preview:** ${web.url}

        Each push redeploys the \`${config.stage}\` stage. Closing the pull request destroys it.
      `,
    });
  }

  return { websiteUrl: web.url.as<string>() };
});

export default Alchemy.Stack(
  project.stackName,
  {
    providers: Layer.mergeAll(Cloudflare.providers(), GitHub.providers()),
    state: Cloudflare.state(),
  },
  Infrastructure,
);
