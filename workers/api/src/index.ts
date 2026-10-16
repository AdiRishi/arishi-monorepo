import type { ApiEnv } from "@repo/infra/worker-bindings";
import { WorkerEntrypoint } from "cloudflare:workers";
import { Context, Effect, Layer } from "effect";
import { HttpRouter } from "effect/http";

import { dispatchProfiles } from "./artifacts/dispatch.ts";
import { artifactHttpRoutes } from "./artifacts/http.ts";
import { artifactsRpc, profilingRpc } from "./artifacts/rpc.ts";
import { apiResources } from "./platform/resources.ts";
import { type ApiRequest, apiRequest } from "./platform/worker-request.ts";

const http = HttpRouter.toWebHandler(artifactHttpRoutes);

type ApiServices = Layer.Success<ReturnType<typeof apiResources>> | ApiRequest;

const serve = (
  handler: {
    readonly handler: (
      request: Request,
      context: Context.Context<ApiServices>,
    ) => Promise<Response>;
  },
  request: Request,
  env: ApiEnv,
  executionContext: ExecutionContext,
): Promise<Response> =>
  Effect.runPromise(
    Layer.build(apiResources(env)).pipe(
      Effect.flatMap((resources) =>
        Effect.promise(() =>
          handler.handler(
            request,
            Context.merge(resources, apiRequest.forRequest(env, executionContext)),
          ),
        ),
      ),
      Effect.scoped,
    ),
  );

/** The web app's reads. */
export class ArtifactsApi extends WorkerEntrypoint<ApiEnv> {
  override fetch(request: Request): Promise<Response> {
    return serve(artifactsRpc, request, this.env, this.ctx);
  }
}

/** The processor's view of an artifact it profiles. */
export class ProfilingApi extends WorkerEntrypoint<ApiEnv> {
  override fetch(request: Request): Promise<Response> {
    return serve(profilingRpc, request, this.env, this.ctx);
  }
}

export default {
  fetch: (request, env, executionContext) => serve(http, request, env, executionContext),
  scheduled: (_controller, env) => dispatchProfiles(env),
} satisfies ExportedHandler<ApiEnv>;
