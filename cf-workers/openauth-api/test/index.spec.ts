// test/index.spec.ts
import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import worker from '../src/index';

// use vi.mock to mock node:fs/promises
vi.mock('node:fs/promises', () => ({
  readFile: vi.fn(),
  writeFile: vi.fn(),
  mkdir: vi.fn(),
  access: vi.fn(),
}));

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('OpenAuth API worker', () => {
  describe('Unit Tests', () => {
    let ctx: ExecutionContext;

    beforeEach(() => {
      ctx = createExecutionContext();
    });

    it('should respond to the well-known oauth-authorization-server endpoint', async () => {
      const request = new IncomingRequest('http://worker.com/.well-known/oauth-authorization-server');
      const res = await worker.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);
      expect(res.status).toEqual(200);
      const json = await res.json<Record<string, unknown>>();
      expect(json.issuer).toEqual('http://worker.com');
    });
  });

  describe('Integration Tests', () => {
    it('should respond to the well-known oauth-authorization-server endpoint', async () => {
      const response = await SELF.fetch('http://worker.com/.well-known/oauth-authorization-server');
      expect(response.status).toBe(200);
      const json = await response.json<Record<string, unknown>>();
      expect(json.issuer).toEqual('http://worker.com');
    });
  });
});
