import { default as WorkerDefault, PublicDataService } from '../src/index';

declare module 'cloudflare:test' {
  // Controls the type of `import("cloudflare:test").env`
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ProvidedEnv extends Env {
    PUBLIC_DATA_SERVICE: Service<PublicDataService>;
  }

  // Ensure RPC properties and methods can be accessed with `SELF`
  export const SELF: Service<WorkerDefault>;
}
