import { Hono } from 'hono/tiny';
import { Env } from '../env';
import { publicDataRouter } from './public-data';

export const app = new Hono<{ Bindings: Env }>().route('/public-data', publicDataRouter);

export type AppType = typeof app;
