import { CloudflareStorage } from '@openauthjs/openauth/storage/cloudflare';
import { Env } from '../env';

export const createStorage = (env: Env) => {
  return CloudflareStorage({
    namespace: env.OPENAUTH_KV_STORAGE,
  });
};
