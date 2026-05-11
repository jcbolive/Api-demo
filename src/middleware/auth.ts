import type { MiddlewareHandler } from 'hono';
import type { ApiEnv } from '../types/api';
import { isValidCredential } from '../auth/users';
import { failure } from '../utils/response';

const publicPaths = ['/api/v1/health', '/api/v1/version', '/docs', '/openapi/openapi.yaml', '/api/v1/auth/token', '/api/v1/auth/refresh'];

export const authMiddleware: MiddlewareHandler<ApiEnv> = async (c, next) => {
  const pathname = new URL(c.req.url).pathname;
  if (publicPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))) return next();

  const user = c.req.header('x-api-user');
  const secret = c.req.header('x-api-secret');
  if (!isValidCredential(user, secret)) return failure(c, 'AUTH_INVALID', 'Credenciais inválidas. Envie x-api-user e x-api-secret válidos.', 401);
  c.set('authUser', user);
  return next();
};
