import { Env, LocalExportedHandler } from './env';

export const DOMAIN_MAP: Record<string, string> = {
  'adishwarrishi.com': 'adishwar-rishi.com',
  'www.adishwarrishi.com': 'www.adishwar-rishi.com',
  'turborepo-remote-cache.dev': 'cloudflare.turborepo-remote-cache.dev',
  'www.turborepo-remote-cache.dev': 'cloudflare.turborepo-remote-cache.dev',
};

const handler: LocalExportedHandler<Env> = {
  // eslint-disable-next-line @typescript-eslint/require-await
  async fetch(request, _env, _ctx): Promise<Response> {
    const url = new URL(request.url);
    const mappedDomain: string | undefined = DOMAIN_MAP[url.hostname];
    if (mappedDomain) {
      const redirectUrl = `${url.protocol}//${mappedDomain}${url.pathname}${url.search}`;
      return Response.redirect(redirectUrl, 301);
    }

    console.log('In error stage');
    return Response.json({ error: `No domain mapping found for URL ${url.toString()}` }, { status: 404 });
  },
};

export default handler;
