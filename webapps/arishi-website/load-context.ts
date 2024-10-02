import { type PlatformProxy } from 'wrangler';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Env {}

type Cloudflare = Omit<PlatformProxy<Env>, 'dispose'>;

declare module '@remix-run/cloudflare' {
  interface AppLoadContext {
    cloudflare: Cloudflare;
  }
}
