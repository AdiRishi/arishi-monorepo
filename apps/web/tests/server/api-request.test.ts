import { AppRequestError } from "@repo/contracts/app";
import { clientOverBinding } from "@repo/contracts/client";
import { CancelledError } from "@tanstack/react-query";
import { Effect, Schema } from "effect";
import { Rpc, RpcGroup } from "effect/rpc";
import { expect, test } from "vitest";

import { createQueryClient } from "@/lib/query-client";
import { runApiRequest } from "@/server/api-request";

const signal = () => new AbortController().signal;

class ReadRpcs extends RpcGroup.make(Rpc.make("read", { success: Schema.String })) {}

const read = (fetch: typeof globalThis.fetch) =>
  Effect.scoped(
    Effect.flatMap(
      clientOverBinding(ReadRpcs, { binding: { fetch }, service: "reader", timeout: "20 millis" }),
      (client) => client.read(),
    ),
  );

test("RPC transport failures do not disclose internal diagnostics", async () => {
  const failing = read(() =>
    Promise.reject(new Error("private.service.internal: sensitive credentials")),
  );

  await expect(runApiRequest(failing, signal())).rejects.toEqual(
    new AppRequestError("unavailable", "The service is temporarily unavailable. Please try again."),
  );
});

test("unexpected defects become safe internal errors", async () => {
  await expect(runApiRequest(Effect.die(new Error("private query")), signal())).rejects.toEqual(
    new AppRequestError("internal", "The request could not be completed."),
  );
});

test("cancelling a query interrupts its request scope without producing an application error", async () => {
  const started = Promise.withResolvers<void>();
  const stopped = Promise.withResolvers<void>();
  const client = createQueryClient();
  try {
    const result = client
      .query({
        queryKey: ["cancel"],
        queryFn: ({ signal }) =>
          runApiRequest(
            Effect.sync(() => started.resolve()).pipe(
              Effect.andThen(Effect.never),
              Effect.ensuring(Effect.sync(() => stopped.resolve())),
            ),
            signal,
          ),
      })
      .catch((error: Error) => error);
    await started.promise;
    await client.cancelQueries({ queryKey: ["cancel"] });
    expect(await result).toBeInstanceOf(CancelledError);
    await stopped.promise;
  } finally {
    client.clear();
  }
});

test("an RPC with no answer by its deadline becomes a retryable unavailable error", async () => {
  const silent = read(() => new Promise<Response>(() => {}));

  await expect(runApiRequest(silent, signal())).rejects.toEqual(
    new AppRequestError("unavailable", "The service is temporarily unavailable. Please try again."),
  );
});
