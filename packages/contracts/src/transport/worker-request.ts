import { Context } from "effect";

export interface WorkerRequest<Env, RuntimeContext> {
  readonly env: Env;
  readonly executionContext: RuntimeContext;
}

export const makeWorkerRequestContext = <Env, RuntimeContext>(key: string) => {
  const service = Context.Service<WorkerRequest<Env, RuntimeContext>>(key);

  return {
    forRequest: (env: Env, executionContext: RuntimeContext) =>
      Context.make(service, { env, executionContext }),
    service,
  } as const;
};
