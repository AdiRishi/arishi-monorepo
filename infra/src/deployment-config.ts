import * as Alchemy from "alchemy";
import * as Config from "effect/Config";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Record from "effect/Record";
import * as Schema from "effect/Schema";

interface StagePolicy {
  readonly environment: "local" | "staging" | "production" | "test";
  readonly web: { readonly workersDev: boolean; readonly domain: string | null };
}

const stages = {
  dev: { environment: "local", web: { workersDev: true, domain: null } },
  staging: { environment: "staging", web: { workersDev: true, domain: null } },
  prod: { environment: "production", web: { workersDev: true, domain: null } },
} as const;

const TestStage = Schema.TemplateLiteral([
  "test-",
  Schema.String.check(Schema.isPattern(/^[a-f0-9]{8}$/u)),
]);
export const Stage = Schema.Union([Schema.Literals(Record.keys(stages)), TestStage]);
export type Stage = typeof Stage.Type;

export const decodeStage = Function.flow(
  Schema.decodeUnknownEffect(Stage),
  Effect.mapError((error) => new Config.ConfigError(error)),
);

export const stagePolicy = (stage: Stage): StagePolicy =>
  Object.entries(stages).find(([name]) => name === stage)?.[1] ?? {
    environment: "test",
    web: { workersDev: true, domain: null },
  };

export const deploymentConfig = Effect.fn("ApplicationPlatform.DeploymentConfig")(function* () {
  const stack = yield* Alchemy.Stack;
  const stage = yield* decodeStage(stack.stage);
  return { ...stagePolicy(stage), stage };
});

export type DeploymentConfig = Effect.Success<ReturnType<typeof deploymentConfig>>;
