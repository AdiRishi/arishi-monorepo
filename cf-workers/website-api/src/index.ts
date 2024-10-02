import { Env, LocalExportedHandler } from './env';
import { PublicDataService } from './rpc-services/public-data-service';

// RPC Service Exports
export { PublicDataService };

const handler: LocalExportedHandler<Env> = {
  // eslint-disable-next-line @typescript-eslint/require-await
  async fetch(_request, _env, _ctx): Promise<Response> {
    return new Response('Hello world');
  },
};

export default handler;
