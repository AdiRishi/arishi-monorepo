import { Effect, Layer } from "effect";
import { HttpRouter } from "effect/http";
import type { Rpc, RpcGroup } from "effect/rpc";
import { RpcSerialization, RpcServer } from "effect/rpc";

import { rpcPath } from "./protocol.ts";

export const rpcHttpRouter = <Rpcs extends Rpc.Any, R>(
  group: RpcGroup.RpcGroup<Rpcs>,
  handlers: Layer.Layer<Rpc.ToHandler<Rpcs> | Rpc.Middleware<Rpcs>, never, R>,
) =>
  HttpRouter.add(
    "POST",
    rpcPath,
    RpcServer.toHttpEffect(group).pipe(
      Effect.provide(handlers),
      Effect.provide(RpcSerialization.layerJson),
      Effect.flatMap((handler) => handler),
    ),
  );

export const rpcWebHandler = <Rpcs extends Rpc.Any, R>(
  group: RpcGroup.RpcGroup<Rpcs>,
  handlers: Layer.Layer<Rpc.ToHandler<Rpcs> | Rpc.Middleware<Rpcs>, never, R>,
) => HttpRouter.toWebHandler(rpcHttpRouter(group, handlers));
