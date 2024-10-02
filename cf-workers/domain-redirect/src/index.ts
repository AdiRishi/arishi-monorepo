import { Env, LocalExportedHandler } from './env';

const handler: LocalExportedHandler<Env> = {
  async fetch(request, env, ctx): Promise<Response> {
    return new Response('Hello World!');
  },
};

export default handler;
