import { cloudflareTest, readD1Migrations } from "@cloudflare/vitest-plugin";
import { workerCompatibility } from "@repo/infra/cloudflare-config";
import { type Json, kCurrentWorker } from "miniflare";

/*
 * How a Worker's bindings are stood in for when its E2E tests run it on the
 * Cloudflare Vitest plugin. Each Worker lists a stand-in for every binding
 * of its env, so a binding added in `@repo/infra/worker-bindings` fails the
 * Worker's test typecheck until its tests say what the binding becomes.
 */

/** A D1 database that Miniflare emulates, empty until the tests apply its migrations. */
interface D1StandIn {
  readonly kind: "d1";
}

/** An R2 bucket that Miniflare emulates, empty at the start of each test. */
interface R2StandIn {
  readonly kind: "r2";
}

/** A Durable Object namespace, with SQLite storage, for a class the Worker under test exports. */
interface DurableObjectStandIn {
  readonly kind: "durable-object";
  readonly className: string;
}

/** A service or queue played by one of the test entry's own entrypoints. */
interface EntrypointStandIn {
  readonly kind: "entrypoint";
  readonly entrypoint: string;
}

/** A service the tests never reach. A call to it fails with a message naming the binding. */
interface UnreachableStandIn {
  readonly kind: "unreachable";
}

interface TextStandIn<Value extends string> {
  readonly kind: "text";
  readonly value: Value;
}

export const d1: D1StandIn = { kind: "d1" };

export const r2: R2StandIn = { kind: "r2" };

export const durableObject = (className: string): DurableObjectStandIn => ({
  kind: "durable-object",
  className,
});

export const entrypoint = (name: string): EntrypointStandIn => ({
  kind: "entrypoint",
  entrypoint: name,
});

export const unreachable: UnreachableStandIn = { kind: "unreachable" };

export const text = <const Value extends string>(value: Value): TextStandIn<Value> => ({
  kind: "text",
  value,
});

type StandIn<Binding> = Binding extends D1Database
  ? D1StandIn
  : Binding extends R2Bucket
    ? R2StandIn
    : Binding extends DurableObjectNamespace
      ? DurableObjectStandIn
      : Binding extends string
        ? TextStandIn<Binding>
        : EntrypointStandIn | UnreachableStandIn;

type AnyStandIn =
  | D1StandIn
  | R2StandIn
  | DurableObjectStandIn
  | EntrypointStandIn
  | UnreachableStandIn
  | TextStandIn<string>;

export type TestBindings<Env> = { readonly [Name in keyof Env]-?: StandIn<Env[Name]> };

type ServiceBinding =
  | { readonly name: typeof kCurrentWorker; readonly entrypoint: string }
  | (() => Response);

/**
 * The Cloudflare Vitest plugin for a Worker's E2E tests. `main` is the test
 * entry, which re-exports the Worker and adds the entrypoints its stand-ins
 * name. When given, the D1 migrations reach the tests as `TEST_MIGRATIONS`.
 */
export const workerTest = <Env>(options: {
  readonly main: string;
  readonly bindings: TestBindings<Env>;
  readonly migrations?: string;
}) =>
  cloudflareTest(async () => {
    const d1Databases: Array<string> = [];
    const r2Buckets: Array<string> = [];
    const durableObjects: Record<string, { className: string; useSQLite: true }> = {};
    const serviceBindings: Record<string, ServiceBinding> = {};
    const bindings: Record<string, Json> = {};
    for (const [name, standIn] of Object.entries<AnyStandIn>(options.bindings)) {
      switch (standIn.kind) {
        case "d1":
          d1Databases.push(name);
          break;
        case "r2":
          r2Buckets.push(name);
          break;
        case "durable-object":
          durableObjects[name] = { className: standIn.className, useSQLite: true };
          break;
        case "text":
          bindings[name] = standIn.value;
          break;
        case "entrypoint":
          serviceBindings[name] = { name: kCurrentWorker, entrypoint: standIn.entrypoint };
          break;
        case "unreachable":
          serviceBindings[name] = () =>
            new Response(`${name} is not part of these tests.`, { status: 500 });
          break;
        default: {
          const unknownStandIn: never = standIn;
          return unknownStandIn;
        }
      }
    }
    if (options.migrations !== undefined) {
      bindings["TEST_MIGRATIONS"] = await readD1Migrations(options.migrations);
    }
    return {
      main: options.main,
      miniflare: {
        compatibilityDate: workerCompatibility.date,
        // Gives `exports.default` the `queue()` and `scheduled()` that tests
        // drive a Worker's queue and cron handlers with, rather than treating
        // them as RPC calls to methods of the same name.
        compatibilityFlags: ["service_binding_extra_handlers"],
        bindings,
        d1Databases,
        durableObjects,
        r2Buckets,
        serviceBindings,
      },
    };
  });
