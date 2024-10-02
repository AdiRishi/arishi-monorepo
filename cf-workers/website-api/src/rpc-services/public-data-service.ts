import { WorkerEntrypoint } from 'cloudflare:workers';
import { Env } from '../env';

export class PublicDataService extends WorkerEntrypoint<Env> {
  ping() {
    return 'pong';
  }
}
