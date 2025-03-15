import { Env, LocalExportedHandler } from './env';
import { createIssuer } from './openauth/issuer';

const handler: LocalExportedHandler<Env> = {
  async fetch(request, env, ctx): Promise<Response> {
    const issuer = createIssuer(env);
    return issuer.fetch(request, env, ctx);
  },
};

export default handler;
