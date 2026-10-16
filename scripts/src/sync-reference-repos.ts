#!/usr/bin/env node
import * as NodeChildProcess from "node:child_process";
import * as NodeFS from "node:fs";
import * as NodePath from "node:path";

import { NodeRuntime, NodeServices } from "@effect/platform-node";
import { Console, Effect, Option, Schema } from "effect";
import { Command, Flag } from "effect/cli";
import * as YAML from "yaml";

import { referenceRepos, type ReferenceRepo } from "../lib/reference-repos.ts";

const repoRoot = NodePath.resolve(import.meta.dirname, "../..");
const WorkspaceCatalog = Schema.Struct({
  catalog: Schema.Record(Schema.String, Schema.String),
});
const decodeWorkspaceCatalog = Schema.decodeUnknownSync(WorkspaceCatalog);

const selectedRepos = (repoId: string | undefined) => {
  if (repoId === undefined) return referenceRepos;
  const selected = referenceRepos.find((repo) => repo.id === repoId);
  if (selected === undefined) {
    throw new Error(`Unknown reference repo "${repoId}".`);
  }
  return [selected];
};

const pinnedVersion = (repo: ReferenceRepo) => {
  const source = NodeFS.readFileSync(NodePath.join(repoRoot, repo.versionSourcePath), "utf8");
  const workspace = decodeWorkspaceCatalog(YAML.parse(source));
  const version = workspace.catalog[repo.catalogPackage];
  if (version === undefined) {
    throw new Error(`catalog.${repo.catalogPackage} is missing from ${repo.versionSourcePath}.`);
  }
  return version;
};

const assertCleanWorkingTree = () => {
  const status = NodeChildProcess.execFileSync("git", ["status", "--porcelain"], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  if (status.trim().length > 0) {
    throw new Error("Commit or stash changes before syncing reference repositories.");
  }
};

const command = Command.make(
  "sync:repos",
  {
    dryRun: Flag.Boolean("dry-run").pipe(Flag.withDefault(false)),
    latest: Flag.Boolean("latest").pipe(Flag.withDefault(false)),
    repo: Flag.String("repo").pipe(Flag.optional),
  },
  ({ dryRun, latest, repo }) =>
    Effect.try(() => {
      const repos = selectedRepos(Option.getOrUndefined(repo));
      if (!dryRun) assertCleanWorkingTree();

      for (const repo of repos) {
        const action = NodeFS.existsSync(NodePath.join(repoRoot, repo.prefix)) ? "pull" : "add";
        const ref = latest ? repo.latestRef : `${repo.versionTagPrefix}${pinnedVersion(repo)}`;
        const args = [
          "subtree",
          action,
          `--prefix=${repo.prefix}`,
          repo.repository,
          ref,
          "--squash",
        ];
        process.stdout.write(`[sync:repos] ${repo.id}: git ${args.join(" ")}\n`);
        if (dryRun) continue;

        const result = NodeChildProcess.spawnSync("git", args, { cwd: repoRoot, stdio: "inherit" });
        if (result.status !== 0) {
          throw new Error(`git subtree ${action} failed with exit code ${result.status}.`);
        }
      }
    }).pipe(
      Effect.tapError((error) =>
        Console.error(error.cause instanceof Error ? error.cause.message : String(error.cause)),
      ),
    ),
).pipe(
  Command.withDescription("Synchronize vendored reference repositories with pinned versions."),
);

command.pipe(
  Command.run({ version: "1.0.0" }),
  Effect.provide(NodeServices.layer),
  NodeRuntime.runMain({ disableErrorReporting: true }),
);
