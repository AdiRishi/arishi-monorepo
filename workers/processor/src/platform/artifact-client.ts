import { ProfilingRpcs } from "@repo/contracts/artifacts";
import { clientOverBinding } from "@repo/contracts/client";
import type { ProcessorEnv } from "@repo/infra/worker-bindings";
import { Context, Effect, Layer } from "effect";

import { ProfileFailure } from "../artifacts/errors.ts";

const failWith =
  (message: string) =>
  <A, E, R>(effect: Effect.Effect<A, E, R>) =>
    Effect.mapError(effect, (cause) => new ProfileFailure({ cause, message }));

export class ArtifactClient extends Context.Service<ArtifactClient>()("Processor/ArtifactClient", {
  make: (binding: ProcessorEnv["API"]) =>
    Effect.map(
      clientOverBinding(ProfilingRpcs, { binding, service: "api", timeout: "5 seconds" }),
      (api) => ({
        getProfileSource: Effect.fn("ArtifactClient.getProfileSource")(
          (...args: Parameters<typeof api.getProfileSource>) =>
            api.getProfileSource(...args).pipe(failWith("The artifact source could not be read.")),
        ),
        startProfile: Effect.fn("ArtifactClient.startProfile")(
          (...args: Parameters<typeof api.startProfile>) =>
            api
              .startProfile(...args)
              .pipe(failWith("The artifact could not be marked as processing.")),
        ),
        completeProfile: Effect.fn("ArtifactClient.completeProfile")(
          (...args: Parameters<typeof api.completeProfile>) =>
            api.completeProfile(...args).pipe(failWith("The profile result could not be stored.")),
        ),
        failProfile: Effect.fn("ArtifactClient.failProfile")(
          (...args: Parameters<typeof api.failProfile>) =>
            api.failProfile(...args).pipe(failWith("The artifact failure could not be stored.")),
        ),
      }),
    ),
}) {
  static readonly layer = (binding: ProcessorEnv["API"]) =>
    Layer.effect(ArtifactClient, ArtifactClient.make(binding));
}
