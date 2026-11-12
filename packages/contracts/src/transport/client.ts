import { Duration, Effect, Layer } from "effect";
import { FetchHttpClient, Headers, HttpClient, HttpClientRequest } from "effect/http";
import type { Rpc, RpcGroup } from "effect/rpc";
import { RpcClient, RpcClientError, RpcSerialization } from "effect/rpc";

import { rpcPath } from "./protocol.ts";

export type ClientFor<Group> = RpcClient.RpcClient<
  RpcGroup.Rpcs<Group>,
  RpcClientError.RpcClientError
>;

export interface ServiceBinding {
  readonly fetch: typeof globalThis.fetch;
}

interface BindingOptions {
  readonly binding: ServiceBinding;
  readonly service: string;
  readonly timeout: Duration.Input;
  /** Extra request headers, such as a forwarded caller token. */
  readonly headers?: Headers.Input;
}

const httpClientOverBinding = (options: BindingOptions) =>
  Layer.effect(
    HttpClient.HttpClient,
    Effect.map(HttpClient.HttpClient, (client) =>
      client.pipe(
        HttpClient.mapRequest(HttpClientRequest.setHeaders(options.headers ?? [])),
        HttpClient.timeout(options.timeout),
      ),
    ),
  ).pipe(
    Layer.provide(FetchHttpClient.layer),
    Layer.provide(
      Layer.succeed(FetchHttpClient.Fetch)(options.binding.fetch.bind(options.binding)),
    ),
  );

export const clientOverBinding = <Rpcs extends Rpc.Any>(
  group: RpcGroup.RpcGroup<Rpcs>,
  options: BindingOptions,
) =>
  RpcClient.make(group).pipe(
    Effect.provide(
      RpcClient.layerProtocolHttp({ url: `http://${options.service}.internal${rpcPath}` }).pipe(
        Layer.provide([RpcSerialization.layerJson, httpClientOverBinding(options)]),
      ),
    ),
  );
