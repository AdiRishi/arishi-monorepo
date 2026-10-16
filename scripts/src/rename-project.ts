#!/usr/bin/env node
import * as NodeFS from "node:fs";
import * as NodePath from "node:path";

import { Schema } from "effect";

const root = NodePath.resolve(import.meta.dirname, "../..");
const oldName = "application-platform-starter";

const name = process.argv[2];
if (name === undefined || name.length > 32 || !/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(name)) {
  process.stderr.write("Usage: pnpm rename <kebab-case-name>\n");
  process.exit(1);
}

const title = name
  .split("-")
  .map((part) => `${part[0]?.toUpperCase()}${part.slice(1)}`)
  .join(" ");
const stackName = title.replaceAll(" ", "");

const packagePath = NodePath.join(root, "package.json");
const packageJson = Schema.decodeSync(Schema.fromJsonString(Schema.JsonObject))(
  NodeFS.readFileSync(packagePath, "utf8"),
);
const packageName = Schema.decodeUnknownSync(Schema.String)(packageJson.name);
if (packageName !== oldName) {
  throw new Error(`Expected package name "${oldName}", received "${packageName}".`);
}
const renamedPackage = { ...packageJson, name };

const projectPath = NodePath.join(root, "infra/src/project.ts");
const projectSource = NodeFS.readFileSync(projectPath, "utf8");

const readmePath = NodePath.join(root, "README.md");
const readme = NodeFS.readFileSync(readmePath, "utf8");
for (const [source, target] of [
  [projectSource, "ApplicationPlatformStarter"],
  [readme, "# Application Platform Starter"],
] as const) {
  if (source.split(target).length !== 2)
    throw new Error(`Expected exactly one ${target} replacement target.`);
}
NodeFS.writeFileSync(packagePath, `${JSON.stringify(renamedPackage, null, 2)}\n`);
NodeFS.writeFileSync(projectPath, projectSource.replace("ApplicationPlatformStarter", stackName));
NodeFS.writeFileSync(readmePath, readme.replace("# Application Platform Starter", `# ${title}`));

process.stdout.write(`Renamed the project to ${name}. Run pnpm install to refresh the lockfile.\n`);
