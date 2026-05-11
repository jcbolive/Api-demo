import type { MiddlewareHandler } from 'hono';
import type { ApiEnv } from '../types/api';
import { requestId } from '../utils/random';

export const requestIdMiddleware: MiddlewareHandler<ApiEnv> = async (c, next) => {
  c.set('requestId', c.req.header('x-request-id') ?? requestId());
  c.set('startedAt', Date.now());
  await next();
  c.header('x-request-id', c.get('requestId'));
  c.header('x-api-platform', 'mock-api-platform');
  c.header('content-type', 'application/json; charset=utf-8');
};
