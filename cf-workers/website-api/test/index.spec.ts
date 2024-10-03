// test/index.spec.ts
import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect, beforeEach } from 'vitest';
import worker from '../src/index';

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('Website API worker', () => {
  describe('Unit Tests', () => {
    let ctx: ExecutionContext;

    beforeEach(() => {
      ctx = createExecutionContext();
    });

    it('should return pong from public-data service ping', async () => {
      const res = await env.PUBLIC_DATA_SERVICE.ping();
      expect(res).toEqual('pong');
    });

    it('should return a pong from http fetch to public data ping', async () => {
      const request = new IncomingRequest('http://worker.com/public-data/ping');
      const res = await worker.fetch(request, env, ctx);
      expect(res.status).toEqual(200);
      const text = await res.text();
      expect(text).toEqual('pong');
    });
  });

  describe('Integration Tests', () => {
    it('should return a pong from http fetch to public data ping', async () => {
      const response = await SELF.fetch('http://website-api.com/public-data/ping');
      expect(response.status).toBe(200);
      expect(await response.text()).toEqual('pong');
    });
  });
});
