import type { MiddlewareHandler } from 'hono';
import type { ApiEnv } from '../types/api';

export const loggerMiddleware: MiddlewareHandler<ApiEnv> = async (c, next) => {
  const start = Date.now();
  await next();
  console.log(JSON.stringify({ requestId: c.get('requestId'), method: c.req.method, path: new URL(c.req.url).pathname, status: c.res.status, durationMs: Date.now() - start }));
};
