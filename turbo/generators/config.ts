/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { addCustomActions } from './customActions';
import { addCustomHelpers } from './helpers';
import { getRelativePath } from './helpers';
import { PlopTypes } from '@turbo/gen';
import path from 'path';

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  addCustomActions(plop);
  addCustomHelpers(plop);

  plop.setGenerator('new-generator', {
    description: 'Create a new empty generator at any path in the project',
    prompts: [
      {
        type: 'input',
        name: 'path',
        message: 'Where should the generator be created? (relative to the project root)',
      },
    ],
    actions: function (data) {
      void data;
      const actions: PlopTypes.ActionType[] = [];
      actions.push(
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/{{ path }}/turbo/generators/config.ts',
          templateFile: 'templates/config.ts.hbs',
          data: {
            customActionPath: `${path.join(
              getRelativePath(
                path.join(data?.turbo.paths.root, data?.path, 'turbo/generators'),
                data?.turbo.paths.root
              ),
              '/turbo/generators/customActions'
            )}`,
            customHelperPath: `${path.join(
              getRelativePath(
                path.join(data?.turbo.paths.root, data?.path, 'turbo/generators'),
                data?.turbo.paths.root
              ),
              '/turbo/generators/helpers'
            )}`,
          },
        },
        {
          type: 'createDir',
          path: '{{ path }}/turbo/generators/templates',
        } as PlopTypes.ActionConfig,
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/{{ path }}/turbo/generators/templates/.gitkeep',
          template: '',
        }
      );
      return actions;
    },
  });

  plop.setGenerator('new-api-worker', {
    description: 'Create a new Cloudflare worker using Hono.js.',
    prompts: [
      {
        type: 'input',
        name: 'workerName',
        message: 'What is the name of the worker? Use dash-case. E.g rest-api',
      },
    ],
    actions: function (data) {
      void data;
      const actions: PlopTypes.ActionType[] = [];
      actions.push(
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/workers/{{ dashCase workerName }}/package.json',
          templateFile: 'templates/worker-templates/package.json.hbs',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/workers/{{ dashCase workerName }}/tsconfig.json',
          templateFile: 'templates/worker-templates/tsconfig.json.hbs',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/workers/{{ dashCase workerName }}/.eslintignore',
          templateFile: 'templates/worker-templates/.eslintignore',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/workers/{{ dashCase workerName }}/.prettierrc.json',
          templateFile: 'templates/worker-templates/.prettierrc.json',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/workers/{{ dashCase workerName }}/.prettierignore',
          templateFile: 'templates/worker-templates/.prettierignore',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/workers/{{ dashCase workerName }}/.eslintrc.cjs',
          templateFile: 'templates/worker-templates/.eslintrc.cjs.hbs',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/workers/{{ dashCase workerName }}/.gitignore',
          templateFile: 'templates/worker-templates/.gitignore.hbs',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/workers/{{ dashCase workerName }}/turbo.json',
          templateFile: 'templates/worker-templates/turbo.json.hbs',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/workers/{{ dashCase workerName }}/vitest.config.ts',
          templateFile: 'templates/worker-templates/vitest.config.ts.hbs',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/workers/{{ dashCase workerName }}/wrangler.toml',
          templateFile: 'templates/worker-templates/wrangler.toml.hbs',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/workers/{{ dashCase workerName }}/.dev.vars',
          template: 'ENVIRONMENT=development\n',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/workers/{{ dashCase workerName }}/src/index.ts',
          templateFile: 'templates/worker-templates/src/index.ts.hbs',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/workers/{{ dashCase workerName }}/src/index.test.ts',
          templateFile: 'templates/worker-templates/src/index.test.ts.hbs',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/workers/{{ dashCase workerName }}/src/routes/index.ts',
          templateFile: 'templates/worker-templates/src/routes/index.ts.hbs',
        }
      );
      return actions;
    },
  });

  plop.setGenerator('new-remix-app', {
    description: 'Create a new Remix app hosted using Cloudflare Pages.',
    prompts: [
      {
        type: 'input',
        name: 'appName',
        message: 'What is the name of the webapp? Use dash-case. E.g my-webapp',
      },
    ],
    actions: function (data) {
      const actions: PlopTypes.ActionType[] = [];
      actions.push(
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/.gitattributes',
          templateFile: 'templates/remix-template/.gitattributes',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/.gitignore',
          templateFile: 'templates/remix-template/.gitignore',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/.eslintignore',
          templateFile: 'templates/remix-template/.eslintignore',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/.prettierrc.json',
          templateFile: 'templates/remix-template/.prettierrc.json',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/.prettierignore',
          templateFile: 'templates/remix-template/.prettierignore',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/.eslintrc.cjs',
          templateFile: 'templates/remix-template/.eslintrc.cjs',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/package.json',
          templateFile: 'templates/remix-template/package.json.hbs',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/remix.config.js',
          templateFile: 'templates/remix-template/remix.config.js',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/tsconfig.json',
          templateFile: 'templates/remix-template/tsconfig.json',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/turbo.json',
          templateFile: 'templates/remix-template/turbo.json',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/tailwind.config.ts',
          templateFile: 'templates/remix-template/tailwind.config.ts',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/postcss.config.js',
          templateFile: 'templates/remix-template/postcss.config.js',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/server.ts',
          templateFile: 'templates/remix-template/server.ts',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/public/_headers',
          templateFile: 'templates/remix-template/public/_headers',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/public/_routes.json',
          templateFile: 'templates/remix-template/public/_routes.json',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/public/favicon.ico',
          templateFile: 'templates/remix-template/public/favicon.ico',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/app/root.tsx',
          templateFile: 'templates/remix-template/app/root.tsx',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/app/entry.client.tsx',
          templateFile: 'templates/remix-template/app/entry.client.tsx',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/app/entry.server.tsx',
          templateFile: 'templates/remix-template/app/entry.server.tsx',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/app/global-styles/tailwind.css',
          templateFile: 'templates/remix-template/app/global-styles/tailwind.css',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/remix.env.d.ts',
          templateFile: 'templates/remix-template/remix.env.d.ts',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/app/routes/_index.tsx',
          templateFile: 'templates/remix-template/app/routes/_index.tsx.hbs',
        }
      );
      return actions;
    },
  });

  plop.setGenerator('new-shadcn-remix-app', {
    description: 'Create a new Remix app with Shadcn installed hosted using Cloudflare Pages.',
    prompts: [
      {
        type: 'input',
        name: 'appName',
        message: 'What is the name of the webapp? Use dash-case. E.g my-webapp',
      },
    ],
    actions: function (data) {
      const actions: PlopTypes.ActionType[] = [];
      actions.push(
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/.gitattributes',
          templateFile: 'templates/remix-shadcn-template/.gitattributes',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/.gitignore',
          templateFile: 'templates/remix-shadcn-template/.gitignore',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/.eslintignore',
          templateFile: 'templates/remix-shadcn-template/.eslintignore',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/.prettierrc.json',
          templateFile: 'templates/remix-shadcn-template/.prettierrc.json',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/.prettierignore',
          templateFile: 'templates/remix-shadcn-template/.prettierignore',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/.eslintrc.cjs',
          templateFile: 'templates/remix-shadcn-template/.eslintrc.cjs',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/package.json',
          templateFile: 'templates/remix-shadcn-template/package.json.hbs',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/remix.config.js',
          templateFile: 'templates/remix-shadcn-template/remix.config.js',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/components.json',
          templateFile: 'templates/remix-shadcn-template/components.json',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/tsconfig.json',
          templateFile: 'templates/remix-shadcn-template/tsconfig.json',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/turbo.json',
          templateFile: 'templates/remix-shadcn-template/turbo.json',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/tailwind.config.ts',
          templateFile: 'templates/remix-shadcn-template/tailwind.config.ts',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/postcss.config.js',
          templateFile: 'templates/remix-shadcn-template/postcss.config.js',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/server.ts',
          templateFile: 'templates/remix-shadcn-template/server.ts',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/public/_headers',
          templateFile: 'templates/remix-shadcn-template/public/_headers',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/public/_routes.json',
          templateFile: 'templates/remix-shadcn-template/public/_routes.json',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/public/favicon.ico',
          templateFile: 'templates/remix-shadcn-template/public/favicon.ico',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/app/root.tsx',
          templateFile: 'templates/remix-shadcn-template/app/root.tsx',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/app/entry.client.tsx',
          templateFile: 'templates/remix-shadcn-template/app/entry.client.tsx',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/app/entry.server.tsx',
          templateFile: 'templates/remix-shadcn-template/app/entry.server.tsx',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/app/global-styles/tailwind.css',
          templateFile: 'templates/remix-shadcn-template/app/global-styles/tailwind.css',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/remix.env.d.ts',
          templateFile: 'templates/remix-shadcn-template/remix.env.d.ts',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/app/routes/_index.tsx',
          templateFile: 'templates/remix-shadcn-template/app/routes/_index.tsx.hbs',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.workspace }}/apps/{{ dashCase appName }}/app/lib/utils.ts',
          templateFile: 'templates/remix-shadcn-template/app/lib/utils.ts',
        }
      );
      return actions;
    },
  });
}
