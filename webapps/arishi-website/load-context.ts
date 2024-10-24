import { PublicDataService } from '@arishi/website-api';
import { type PlatformProxy } from 'wrangler';

interface Env {
  PUBLIC_DATA_SERVICE: Service<PublicDataService>;
  WEBSITE_API: Fetcher;
}

type Cloudflare = Omit<PlatformProxy<Env>, 'dispose'>;

declare module '@remix-run/cloudflare' {
  interface AppLoadContext {
    cloudflare: Cloudflare;
  }
  interface Future {
    v3_singleFetch: true;
  }
}
