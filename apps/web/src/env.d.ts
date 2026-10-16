import type { WebsiteEnv } from "@repo/infra/worker-bindings";

declare global {
  namespace Cloudflare {
    interface Env extends WebsiteEnv {}
  }
}

export {};
