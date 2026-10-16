import { Duration, Effect, Layer } from "effect";
import { FetchHttpClient, HttpClient, HttpClientError, HttpClientRequest } from "effect/http";
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

const internalOrigin = (service: string): string => `http://${service}.internal`;

const httpClientOverBinding = (binding: ServiceBinding): Layer.Layer<HttpClient.HttpClient> =>
  Layer.provide(
    FetchHttpClient.layer,
    Layer.succeed(FetchHttpClient.Fetch)(binding.fetch.bind(binding)),
  );

const withTimeout = (
  client: HttpClient.HttpClient,
  timeout: Duration.Input,
): HttpClient.HttpClient =>
  HttpClient.transform(client, (effect, request) =>
    Effect.timeoutOrElse(effect, {
      duration: timeout,
      orElse: () => {
        const description = `No RPC response within ${Duration.format(Duration.fromInputUnsafe(timeout))}.`;
        return Effect.fail(
          new HttpClientError.HttpClientError({
            reason: new HttpClientError.TransportError({
              cause: new Error(description),
              description,
              request,
            }),
          }),
        );
      },
    }),
  );

const timedHttpClientOverBinding = (binding: ServiceBinding, timeout: Duration.Input) =>
  Layer.effect(
    HttpClient.HttpClient,
    Effect.map(HttpClient.HttpClient, (client) => withTimeout(client, timeout)),
  ).pipe(Layer.provide(httpClientOverBinding(binding)));

const withHeaders = (
  client: HttpClient.HttpClient,
  headers: ReadonlyArray<readonly [string, string]>,
) =>
  HttpClient.mapRequest(client, (request) =>
    headers.reduce(
      (current, [name, value]) => HttpClientRequest.setHeader(current, name, value),
      request,
    ),
  );

export const clientOverBinding = <Rpcs extends Rpc.Any>(
  group: RpcGroup.RpcGroup<Rpcs>,
  options: {
    readonly binding: ServiceBinding;
    readonly service: string;
    readonly timeout: Duration.Input;
    /** Extra request headers, such as a forwarded caller token. */
    readonly headers?: ReadonlyArray<readonly [string, string]>;
  },
) =>
  RpcClient.make(group).pipe(
    Effect.provide(
      RpcClient.layerProtocolHttp({
        url: `${internalOrigin(options.service)}${rpcPath}`,
      }).pipe(
        Layer.provide(RpcSerialization.layerJson),
        Layer.provide(
          options.headers === undefined || options.headers.length === 0
            ? timedHttpClientOverBinding(options.binding, options.timeout)
            : Layer.effect(
                HttpClient.HttpClient,
                Effect.map(HttpClient.HttpClient, (client) =>
                  withHeaders(client, options.headers ?? []),
                ),
              ).pipe(Layer.provide(timedHttpClientOverBinding(options.binding, options.timeout))),
        ),
      ),
    ),
  );
