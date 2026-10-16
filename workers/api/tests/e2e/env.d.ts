import type { ApiEnv } from "@repo/infra/worker-bindings";
import type { D1Migration } from "cloudflare:test";

declare global {
  namespace Cloudflare {
    interface Env extends ApiEnv {
      readonly TEST_MIGRATIONS: Array<D1Migration>;
    }

    interface GlobalProps {
      mainModule: typeof import("./worker.ts");
    }
  }
}

export {};
