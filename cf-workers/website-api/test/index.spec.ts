// test/index.spec.ts
import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect, beforeEach } from 'vitest';
import worker from '../src/index';

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('Domain Redirect worker', () => {
  describe('Unit Tests', () => {
    let ctx: ExecutionContext;

    beforeEach(() => {
      ctx = createExecutionContext();
    });

    it('should work', async () => {
      const request = new IncomingRequest('http://website-api.com');
      const response = await worker.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(200);
      expect(await response.text()).toEqual('Hello world');
    });
  });

  describe('Integration Tests', () => {
    it('should work', async () => {
      const response = await SELF.fetch('http://website-api.com');
      expect(response.status).toBe(200);
      expect(await response.text()).toEqual('Hello world');
    });
  });
});
