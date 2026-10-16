import { BrowserCrypto } from "@effect/platform-browser";
import type { ProcessorEnv } from "@repo/infra/worker-bindings";
import { Layer } from "effect";

import { ArtifactProcessing } from "../artifacts/service.ts";
import { ArtifactClient } from "./artifact-client.ts";
import { ProfileSessions } from "./profile-sessions.ts";

export const processorResources = (env: ProcessorEnv) =>
  ArtifactProcessing.layer.pipe(
    Layer.provide([
      ArtifactClient.layer(env.API),
      ProfileSessions.layer(env.PROFILE_SESSIONS),
      BrowserCrypto.layer,
    ]),
  );
