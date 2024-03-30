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
  server: {
    fs: {
      // Restrict files that could be served by Vite's dev server.  Accessing
      // files outside this directory list that aren't imported from an allowed
      // file will result in a 403.  Both directories and files can be provided.
      // If you're comfortable with Vite's dev server making any file within the
      // project root available, you can remove this option.  See more:
      // https://vitejs.dev/config/server-options.html#server-fs-allow
      allow: ['app'],
    },
  },
});
