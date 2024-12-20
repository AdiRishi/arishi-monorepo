import { vitePlugin as remix, cloudflareDevProxyVitePlugin as remixCloudflareDevProxy } from '@remix-run/dev';
import { remixDevTools } from 'remix-development-tools';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { getLoadContext } from './load-context';

export default defineConfig({
  esbuild: {
    target: 'es2022',
  },
  build: {
    minify: true,
  },
  ssr: {
    resolve: {
      conditions: ['workerd', 'worker', 'browser'],
    },
  },
  resolve: {
    mainFields: ['browser', 'module', 'main'],
  },
  plugins: [
    remixDevTools(),
    remixCloudflareDevProxy({
      getLoadContext,
    }),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        // Type augmentation for single fetch is done in load-context.ts
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
        unstable_optimizeDeps: true,
      },
    }),
    tsconfigPaths({ root: '.' }),
    visualizer({ emitFile: true }),
  ],
});
