import { handleRequest } from '.';
import { expect, test, beforeAll, afterAll } from 'vitest';
import { unstable_dev } from 'wrangler';
import type { UnstableDevWorker } from 'wrangler';

const describe = setupMiniflareIsolatedStorage();

describe('domain-redirect worker simulation', () => {
  let worker: UnstableDevWorker;

  beforeAll(async () => {
    worker = await unstable_dev('src/index.ts', {
      ip: '0.0.0.0',
      experimental: { disableExperimentalWarning: true },
    });
  });

  afterAll(async () => {
    await worker.stop();
  });

  test('Worker should be able to boot successfully', () => {
    expect(worker.address).toBeTruthy();
  });

  test('should respond to the ping route by simulating the worker', async () => {
    const response = await worker.fetch('/ping');
    expect(response).toBeTruthy();
    expect(response.status).toBe(404);
  });
});

describe('Redirect behavior', () => {
  test('correctly handles base domains', () => {
    const testDomains = ['adishwarrishi.com'];

    for (const testDomain of testDomains) {
      const request = new Request(`http://${testDomain}/some/path?query=string`);

      const response = handleRequest(request);

      expect(response.status).toBe(301);
      expect(response.headers.get('Location')).toEqual(`http://adishwar-rishi.com/some/path?query=string`);
    }
  });

  test('correctly handles subdomains', () => {
    const testDomains = ['www.adishwarrishi.com'];

    for (const testDomain of testDomains) {
      const request = new Request(`http://${testDomain}/some/path?query=string`);

      const response = handleRequest(request);

      expect(response.status).toBe(301);
      expect(response.headers.get('Location')).toEqual(`http://www.adishwar-rishi.com/some/path?query=string`);
    }
  });

  test('returns 404 response for unknown domains', async () => {
    const testDomain = 'unknown.com';
    const request = new Request(`http://${testDomain}/some/path?query=string`);

    const response = handleRequest(request);

    expect(response.status).toBe(404);
    const responseBody = await response.json<{ error: string }>();
    expect(responseBody.error).toBe(`No domain mapping found for URL ${new URL(request.url).toString()}`);
  });

  test('maintains url path and query parameters during redirection', () => {
    const testDomain = 'adishwarrishi.com';
    const request = new Request(`http://${testDomain}/some/path?query=string`);

    const response = handleRequest(request);

    expect(response.status).toBe(301);
    expect(response.headers.get('Location')).toBe(`http://adishwar-rishi.com/some/path?query=string`);
  });
});
