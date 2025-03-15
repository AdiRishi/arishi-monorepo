import { Env, LocalExportedHandler } from './env';
import { app } from './fetch-handlers/app';
import { PublicDataService } from './rpc-services/public-data-service';

// RPC Service Exports
export { PublicDataService };

const handler: LocalExportedHandler<Env> = {
  async fetch(request, env, ctx): Promise<Response> {
    return app.fetch(request, env, ctx);
  },
};

export default handler;
