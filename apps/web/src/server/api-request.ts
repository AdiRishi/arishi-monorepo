import { AppRequestError } from "@repo/contracts/app";
import { Cause, Effect } from "effect";
import { RpcClientError } from "effect/rpc/RpcClientError";

export const runApiRequest = <A, E>(effect: Effect.Effect<A, E>, signal: AbortSignal): Promise<A> =>
  Effect.runPromise(
    effect.pipe(
      Effect.catchCause((cause) => {
        if (Cause.hasInterruptsOnly(cause)) return Effect.interrupt;
        const failure = Cause.squash(cause);
        if (failure instanceof AppRequestError) return Effect.fail(failure);
        const error =
          failure instanceof RpcClientError
            ? new AppRequestError(
                "unavailable",
                "The service is temporarily unavailable. Please try again.",
              )
            : new AppRequestError("internal", "The request could not be completed.");
        return Effect.logError("API request failed", cause).pipe(
          Effect.andThen(Effect.fail(error)),
        );
      }),
    ),
    { signal },
  );
