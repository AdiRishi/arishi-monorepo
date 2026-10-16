export interface ReferenceRepo {
  readonly catalogPackage: string;
  readonly id: string;
  readonly latestRef: string;
  readonly prefix: string;
  readonly repository: string;
  readonly versionSourcePath: string;
  readonly versionTagPrefix: string;
}

export const referenceRepos: ReadonlyArray<ReferenceRepo> = [
  {
    catalogPackage: "effect",
    id: "effect",
    latestRef: "main",
    prefix: ".repos/effect",
    repository: "https://github.com/Effect-TS/effect.git",
    versionSourcePath: "pnpm-workspace.yaml",
    versionTagPrefix: "effect@",
  },
];
