import { vitePlugin as remix, cloudflareDevProxyVitePlugin as remixCloudflareDevProxy } from '@remix-run/dev';
import { remixDevTools } from 'remix-development-tools';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  build: {
    minify: true,
    manifest: true,
  },
  plugins: [
    remixDevTools(),
    remixCloudflareDevProxy(),
    remix({ future: { v3_fetcherPersist: true, v3_relativeSplatPath: true, v3_throwAbortReason: true } }),
    tsconfigPaths({
      root: '.',
    }),
    visualizer({ emitFile: true }),
  ],
});
