import { strict as assert } from "node:assert";
import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { test, type TestContext } from "node:test";

const repository = resolve(import.meta.dirname, "../..");

const copyWorkspace = (context: TestContext) => {
  const root = mkdtempSync(join(tmpdir(), "reference-sync-"));
  context.after(() => rmSync(root, { recursive: true, force: true }));
  cpSync(join(repository, "scripts/src"), join(root, "scripts/src"), { recursive: true });
  cpSync(join(repository, "scripts/lib"), join(root, "scripts/lib"), { recursive: true });
  symlinkSync(join(repository, "scripts/node_modules"), join(root, "scripts/node_modules"), "dir");
  writeFileSync(join(root, "package.json"), '{"type":"module"}\n');
  writeFileSync(join(root, "pnpm-workspace.yaml"), "catalog:\n  effect: 4.0.0-rc.112\n");
  return root;
};

const runSync = (root: string, args: string[]) =>
  spawnSync(process.execPath, [join(root, "scripts/src/sync-reference-repos.ts"), ...args], {
    cwd: root,
    encoding: "utf8",
    env: { ...process.env, NO_COLOR: "1" },
  });

await test("a missing repository selector fails before attempting git", (context) => {
  const result = runSync(copyWorkspace(context), ["--repo"]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Missing value for flag --repo/);
  assert.doesNotMatch(result.stdout, /\[sync:repos\]/);
});

await test("unknown flags fail before attempting git", (context) => {
  const result = runSync(copyWorkspace(context), ["--dry-rnu"]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unrecognized flag: --dry-rnu/);
  assert.doesNotMatch(result.stdout, /\[sync:repos\]/);
});

await test("unknown repository selectors fail before attempting git", (context) => {
  const result = runSync(copyWorkspace(context), ["--repo", "missing"]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unknown reference repo "missing"/);
  assert.doesNotMatch(result.stderr, /not a git repository/);
});

await test("dry-run prints the pinned add command without requiring a git workspace", (context) => {
  const result = runSync(copyWorkspace(context), ["--dry-run", "--repo", "effect"]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(
    result.stdout,
    "[sync:repos] effect: git subtree add --prefix=.repos/effect https://github.com/Effect-TS/effect.git effect@4.0.0-rc.112 --squash\n",
  );
});

await test("dry-run uses pull and the latest ref for an existing vendor", (context) => {
  const root = copyWorkspace(context);
  mkdirSync(join(root, ".repos/effect"), { recursive: true });
  const result = runSync(root, ["--dry-run", "--latest"]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(
    result.stdout,
    "[sync:repos] effect: git subtree pull --prefix=.repos/effect https://github.com/Effect-TS/effect.git main --squash\n",
  );
});
