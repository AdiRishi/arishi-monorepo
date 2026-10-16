declare global {
  namespace Cloudflare {
    interface GlobalProps {
      // The test entry re-exports the untyped build of this module.
      mainModule: typeof import("../../src/worker.ts");
    }
  }
}

export {};
