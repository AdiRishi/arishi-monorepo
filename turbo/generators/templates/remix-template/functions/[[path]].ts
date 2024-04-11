// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - the server build file is generated by `remix vite:build`
import { createPagesFunctionHandler } from '@remix-run/cloudflare-pages';
import * as build from '../build/server';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
// @ts-expect-error - the server build file is generated by `remix vite:build`
export const onRequest = createPagesFunctionHandler({ build });
