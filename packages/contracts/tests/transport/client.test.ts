import { expect, it } from "@effect/vitest";
import { Effect, Schema } from "effect";
import { HttpRouter } from "effect/http";
import { Rpc, RpcGroup } from "effect/rpc";

import { clientOverBinding } from "../../src/client.ts";
import { rpcHttpRouter } from "../../src/server.ts";

class CallerRpcs extends RpcGroup.make(Rpc.make("caller", { success: Schema.String })) {}

const handlers = CallerRpcs.toLayer({
  caller: (_, { headers }) => Effect.succeed(headers["x-caller"] ?? "anonymous"),
});

it.effect("a client over a binding reaches the server's handler with the caller's headers", () =>
  Effect.gen(function* () {
    const { handler } = yield* Effect.acquireRelease(
      Effect.sync(() =>
        HttpRouter.toWebHandler(rpcHttpRouter(CallerRpcs, handlers), { disableLogger: true }),
      ),
      ({ dispose }) => Effect.promise(dispose),
    );
    const client = yield* clientOverBinding(CallerRpcs, {
      binding: { fetch: (input, init) => handler(new Request(input, init)) },
      service: "callers",
      timeout: "1 second",
      headers: { "x-caller": "web" },
    });

    expect(yield* client.caller()).toBe("web");
  }),
);
