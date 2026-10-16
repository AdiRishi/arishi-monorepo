import { BrowserCrypto } from "@effect/platform-browser";
import { D1Client } from "@effect/sql-d1";
import type { ApiEnv } from "@repo/infra/worker-bindings";
import { Layer } from "effect";

import { ArtifactRepository } from "../artifacts/repository.ts";
import { Artifacts } from "../artifacts/service.ts";

export const apiResources = (env: ApiEnv) =>
  Artifacts.layer.pipe(
    Layer.provideMerge(ArtifactRepository.layer(env.ARTIFACTS)),
    Layer.provide([D1Client.layer({ db: env.DB }), BrowserCrypto.layer]),
  );
