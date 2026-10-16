declare global {
  namespace Cloudflare {
    interface GlobalProps {
      mainModule: typeof import("./worker.ts");
    }
  }
}

export {};
