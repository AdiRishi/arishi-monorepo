import type { ProcessorEnv } from "@repo/infra/worker-bindings";

declare global {
  namespace Cloudflare {
    interface Env extends ProcessorEnv {}

    interface GlobalProps {
      mainModule: typeof import("./worker.ts");
    }
  }
}

export {};
