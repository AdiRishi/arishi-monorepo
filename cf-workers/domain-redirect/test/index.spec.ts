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

    it('redirects adishwarrishi.com to adishwar-rishi.com', async () => {
      const request = new IncomingRequest('http://adishwarrishi.com');
      const response = await worker.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(301);
      expect(response.headers.get('Location')).toBe('http://adishwar-rishi.com/');
    });

    it('returns 404 for unmapped domain', async () => {
      const request = new IncomingRequest('http://unmapped-domain.com');
      const response = await worker.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(404);
      const jsonResponse = await response.json<{ error: string }>();
      expect(jsonResponse.error).toBe('No domain mapping found for URL http://unmapped-domain.com/');
    });
  });

  describe('Integration Tests', () => {
    it('redirects adishwarrishi.com to adishwar-rishi.com', async () => {
      const response = await SELF.fetch('http://adishwarrishi.com', {
        redirect: 'manual',
      });
      expect(response.status).toBe(301);
      expect(response.headers.get('Location')).toBe('http://adishwar-rishi.com/');
    });

    it('returns 404 for unmapped domain', async () => {
      const response = await SELF.fetch('https://unmapped-domain.com');
      expect(response.status).toBe(404);
      const jsonResponse = await response.json<{ error: string }>();
      expect(jsonResponse.error).toBe('No domain mapping found for URL https://unmapped-domain.com/');
    });
  });
});
