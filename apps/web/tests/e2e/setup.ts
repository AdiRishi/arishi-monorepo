import { afterEach } from "vitest";

import { resetApi } from "./support/api.ts";
import { resetProcessor } from "./support/processor.ts";

afterEach(() => {
  resetApi();
  resetProcessor();
});
