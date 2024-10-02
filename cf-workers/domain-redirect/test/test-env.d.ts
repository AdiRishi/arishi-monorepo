import { default as WorkerDefault } from '../src/index';

declare module 'cloudflare:test' {
  // Controls the type of `import("cloudflare:test").env`
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ProvidedEnv extends Env {}

  // Ensure RPC properties and methods can be accessed with `SELF`
  export const SELF: Service<WorkerDefault>;
}
