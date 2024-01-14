import { PlopTypes } from '@turbo/gen';
import { mkdir, symlink } from 'fs/promises';
import handlebars from 'handlebars';
import { join } from 'path';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnswersWithTurbo = Record<string, any> & {
  turbo: {
    paths: {
      root: string;
      workspace: string;
    };
  };
};

export type CreateDirConfig = PlopTypes.ActionConfig & {
  path: string;
};

export type CreateSymlinkConfig = PlopTypes.ActionConfig & {
  path: string;
  destPath: string;
};

const defaultPlopHelpers = [
  'camelCase',
  'snakeCase',
  'dashCase',
  'dotCase',
  'pathCase',
  'pascalCase',
  'lowerCase',
  'sentenceCase',
  'constantCase',
  'titleCase',
];

export function addCustomActions(plop: PlopTypes.NodePlopAPI) {
  plop.setActionType('createDir', async function (ans, cfg) {
    // eslint-disable-next-line @typescript-eslint/no-for-in-array
    for (const helper in plop.getHelperList()) {
      handlebars.registerHelper(helper, plop.getHelper(helper) as unknown as handlebars.HelperDelegate);
    }
    const config = cfg as CreateDirConfig;
    const answers = ans as AnswersWithTurbo;
    if (!config.path) {
      throw 'createDir action requires a path';
    }
    const dirPath = handlebars.compile(config.path)(answers);
    const folderPath = join(answers.turbo.paths.workspace, dirPath);
    await mkdir(folderPath, { recursive: true });
    return `created directory ${folderPath}`;
  });

  plop.setActionType('createSymlink', async function (ans, cfg) {
    for (const helper of defaultPlopHelpers) {
      handlebars.registerHelper(helper, plop.getHelper(helper) as unknown as handlebars.HelperDelegate);
    }
    const config = cfg as CreateSymlinkConfig;
    const answers = ans as AnswersWithTurbo;
    if (!config.path) {
      throw 'createSymlink action requires a path';
    }
    if (!config.destPath) {
      throw 'createSymlink action requires a destPath';
    }
    const destPath = handlebars.compile(config.destPath)(answers);
    const srcPath = handlebars.compile(config.path)(answers);
    await symlink(srcPath, destPath);
    return `created symlink ${destPath} -> ${srcPath}`;
  });
}
