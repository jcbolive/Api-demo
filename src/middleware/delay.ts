import type { MiddlewareHandler } from 'hono';
import type { ApiEnv } from '../types/api';
import { randomInt } from '../utils/random';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const delayMiddleware: MiddlewareHandler<ApiEnv> = async (c, next) => {
  const configured = Number(c.req.header('x-mock-delay-ms') ?? c.req.query('delayMs'));
  const delay = Number.isFinite(configured) && configured > 0 ? Math.min(configured, 3000) : randomInt(40, 220);
  await sleep(delay);
  c.header('x-mock-delay-ms', String(delay));
  await next();
};
