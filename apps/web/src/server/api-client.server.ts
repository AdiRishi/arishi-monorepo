import { ArtifactsRpcs, ProcessingRpcs } from "@repo/contracts/artifacts";
import { clientOverBinding } from "@repo/contracts/client";
import { getRequest } from "@tanstack/react-start/server";
import { env } from "cloudflare:workers";
import { Effect } from "effect";

import { runApiRequest } from "./api-request";

const apiOrigin = "https://api.internal";

export const fetchApi = (path: string, init?: RequestInit) =>
  env.API.fetch(new Request(new URL(path, apiOrigin), init));

const clients = Effect.all({
  artifacts: clientOverBinding(ArtifactsRpcs, {
    binding: env.ARTIFACTS,
    service: "api",
    timeout: "10 seconds",
  }),
  processing: clientOverBinding(ProcessingRpcs, {
    binding: env.PROCESSING,
    service: "processor",
    timeout: "5 seconds",
  }),
});

export type ApiClients = Effect.Success<typeof clients>;

export const callApiRpc = <A, E>(use: (clients: ApiClients) => Effect.Effect<A, E>): Promise<A> =>
  runApiRequest(Effect.scoped(Effect.flatMap(clients, use)), getRequest().signal);
