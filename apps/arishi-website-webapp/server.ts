import { logDevReady } from '@remix-run/cloudflare';
import type { ServerBuild } from '@remix-run/cloudflare';
import { createPagesFunctionHandler } from '@remix-run/cloudflare-pages';
import * as build from '@remix-run/dev/server-build';

if (process.env.NODE_ENV === 'development') {
  // Temporary hack to get around the isSpaMode missing property from the cloudflare export
  logDevReady(build as unknown as ServerBuild);
}

export const onRequest = createPagesFunctionHandler({
  // Temporary hack to get around the isSpaMode missing property from the cloudflare export
  build: build as unknown as ServerBuild,
  getLoadContext: (context) => ({ env: context.env }),
  mode: build.mode,
});
