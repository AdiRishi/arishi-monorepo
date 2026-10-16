declare global {
  namespace Cloudflare {
    interface GlobalProps {
      mainModule: typeof import("../src/worker.ts");
    }
  }
}

export {};
