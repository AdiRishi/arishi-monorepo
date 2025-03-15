import { default as WorkerDefault } from '../src/index';

declare module 'cloudflare:test' {
  // Controls the type of `import("cloudflare:test").env`
  interface ProvidedEnv extends Env {
    OPENAUTH_KV_STORAGE: KVNamespace;
  }

  // Ensure RPC properties and methods can be accessed with `SELF`
  export const SELF: Service<WorkerDefault>;
}
