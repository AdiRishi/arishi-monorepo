import { BrowserCrypto } from "@effect/platform-browser";
import { expect, it } from "@effect/vitest";
import { assertInstanceOf, strictEqual } from "@effect/vitest/utils";
import { maxUploadBytes } from "@repo/contracts/artifacts";
import { Crypto, Deferred, Effect, Exit, Fiber, PlatformError } from "effect";

import { InvalidCsv } from "../../src/artifacts/errors.ts";
import { profileCsv } from "../../src/artifacts/profile-csv.ts";

const bytes = (value: string) => new TextEncoder().encode(value);

it.layer(BrowserCrypto.layer)("profileCsv", (it) => {
  it.effect("reports useful types, ranges, empty cells, and malformed rows", () =>
    Effect.gen(function* () {
      const progress: Array<readonly [number, number]> = [];
      const profile = yield* profileCsv(
        bytes(
          [
            "date,amount,settled,note",
            "2026-08-01,12.50,true,first",
            "2026-08-03,-4,false,",
            "2026-08-02,8.25,true",
          ].join("\n"),
        ),
        (processed, total) => {
          progress.push([processed, total]);
          return Effect.void;
        },
      );

      expect(profile).toMatchObject({
        columns: [
          {
            emptyValues: 0,
            kind: "date",
            maximum: "2026-08-03",
            minimum: "2026-08-01",
            name: "date",
            nonEmptyValues: 3,
          },
          {
            emptyValues: 0,
            kind: "number",
            maximum: 12.5,
            minimum: -4,
            name: "amount",
            nonEmptyValues: 3,
          },
          {
            emptyValues: 0,
            falseValues: 1,
            kind: "boolean",
            name: "settled",
            nonEmptyValues: 3,
            trueValues: 2,
          },
          {
            emptyValues: 2,
            kind: "string",
            name: "note",
            nonEmptyValues: 1,
          },
        ],
        malformedRows: 1,
        rowCount: 3,
      });
      expect(profile.sha256).toBe(
        "d1dbf88ff934dd2613295f3d41282a9f1db0cf075f4e1a018c843244fc1a10c6",
      );
      expect(progress.at(0)).toStrictEqual([0, 3]);
      expect(progress.at(-1)).toStrictEqual([3, 3]);
    }),
  );

  it.effect("keeps impossible calendar dates as strings", () =>
    Effect.gen(function* () {
      const profile = yield* profileCsv(bytes("date\n2026-02-30\n"), () => Effect.void);

      expect(profile.columns[0]).toMatchObject({ kind: "string", name: "date" });
    }),
  );

  it.effect("profiles the supported maximum input size", () =>
    Effect.gen(function* () {
      const source = `value\n${"x".repeat(maxUploadBytes - 7)}\n`;
      const profile = yield* profileCsv(bytes(source), () => Effect.void);
      expect(profile.rowCount).toBe(1);
      expect(profile.columns).toEqual([
        { name: "value", kind: "string", emptyValues: 0, nonEmptyValues: 1 },
      ]);
    }),
  );
  it.effect.each([bytes('name\n"unterminated'), bytes(""), new Uint8Array([0xff])])(
    "invalid CSV input fails through the typed error channel %#",
    (input) =>
      Effect.gen(function* () {
        const error = yield* profileCsv(input, () => Effect.void).pipe(Effect.flip);
        assertInstanceOf(error, InvalidCsv);
        strictEqual(error.message, "The CSV could not be profiled.");
      }),
  );

  it.effect("a digest outage remains a platform failure rather than invalid CSV", () =>
    Effect.gen(function* () {
      const crypto = yield* Crypto.Crypto;
      const outage = PlatformError.systemError({
        _tag: "Unknown",
        module: "Crypto",
        method: "digest",
      });
      const failure = yield* profileCsv(bytes("name\nAdi\n"), () => Effect.void).pipe(
        Effect.provideService(Crypto.Crypto, { ...crypto, digest: () => Effect.fail(outage) }),
        Effect.flip,
      );
      expect(failure).toBe(outage);
      const recovered = yield* profileCsv(bytes("name\nAdi\n"), () => Effect.void);
      expect(recovered.rowCount).toBe(1);
    }),
  );

  it.effect("interrupting profiling releases an in-flight progress report", () =>
    Effect.gen(function* () {
      const started = yield* Deferred.make<void>();
      let released = false;
      const fiber = yield* profileCsv(bytes("name\nAdi"), () =>
        Deferred.succeed(started, undefined).pipe(
          Effect.andThen(Effect.never),
          Effect.ensuring(
            Effect.sync(() => {
              released = true;
            }),
          ),
        ),
      ).pipe(Effect.forkChild);
      yield* Deferred.await(started);
      yield* Fiber.interrupt(fiber);
      expect(Exit.hasInterrupts(yield* Fiber.await(fiber))).toBe(true);
      expect(released).toBe(true);
    }),
  );
});
