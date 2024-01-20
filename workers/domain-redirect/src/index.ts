export type Env = {
  ENVIRONMENT: 'development' | 'production';
  SENTRY_DSN: string;
  SENTRY_PROJECT_NAME: string;
  GITHUB_SHA?: string;
};

export const DOMAIN_MAP: Record<string, string> = {
  'adishwarrishi.com': 'adishwar-rishi.com',
  'www.adishwarrishi.com': 'www.adishwar-rishi.com',
};

export function handleRequest(request: Request): Response {
  const url = new URL(request.url);
  const mappedDomain: string | undefined = DOMAIN_MAP[url.hostname];
  if (mappedDomain) {
    const redirectUrl = `${url.protocol}//${mappedDomain}${url.pathname}${url.search}`;
    return Response.redirect(redirectUrl, 301);
  }

  return Response.json({ error: `No domain mapping found for URL ${url.toString()}` }, { status: 404 });
}

export default {
  fetch(request: Request, _env: Env, _ctx: ExecutionContext): Response {
    return handleRequest(request);
  },
};
