import { makeWorkerRequestContext, type WorkerRequest } from "@repo/contracts/server";
import type { ApiEnv } from "@repo/infra/worker-bindings";

export type ApiRequest = WorkerRequest<ApiEnv, ExecutionContext>;

export const apiRequest = makeWorkerRequestContext<ApiEnv, ExecutionContext>("Api/WorkerRequest");
