import { reset } from "cloudflare:test";
import { beforeEach } from "vitest";

import { resetApi } from "./support/api.ts";

beforeEach(async () => {
  await reset();
  resetApi();
});
