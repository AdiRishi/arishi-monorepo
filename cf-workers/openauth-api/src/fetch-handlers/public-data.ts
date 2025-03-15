import { Hono } from 'hono/tiny';
import { Env } from '../env';

export const publicDataRouter = new Hono<{ Bindings: Env }>().get('/ping', (c) => c.text('pong'));
