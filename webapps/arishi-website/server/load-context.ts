import { PublicDataService } from '@arishi/website-api';
import { PlatformProxy } from 'wrangler';

export interface Env {
  PUBLIC_DATA_SERVICE: Service<PublicDataService>;
  WEBSITE_API: Fetcher;
}

type GetLoadContextArgs = {
  request: Request;
  context: {
    cloudflare: Omit<PlatformProxy<Env>, 'dispose' | 'caches'> & {
      caches: PlatformProxy<Env, IncomingRequestCfProperties>['caches'] | CacheStorage;
    };
  };
};

declare module 'react-router' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface AppLoadContext extends ReturnType<typeof getLoadContext> {
    // This will merge the result of `getLoadContext` into the `AppLoadContext`
  }
}

export const getLoadContext = ({ context }: GetLoadContextArgs) => {
  return context;
};
