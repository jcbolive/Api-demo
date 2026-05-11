import type { MiddlewareHandler } from 'hono';
import type { ApiEnv } from '../types/api';
import { getBearerToken, isValidCredential, validateFakeJwt } from '../auth/users';
import { failure } from '../utils/response';

const publicPaths = ['/api/v1/health', '/api/v1/version', '/docs', '/openapi/openapi.yaml', '/api/v1/auth/token', '/api/v1/auth/refresh'];

export const authMiddleware: MiddlewareHandler<ApiEnv> = async (c, next) => {
  const pathname = new URL(c.req.url).pathname;
  if (publicPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))) return next();

  const bearerValidation = validateFakeJwt(getBearerToken(c.req.header('authorization')));
  if (bearerValidation.valid) {
    c.set('authUser', bearerValidation.subject);
    return next();
  }

  const user = c.req.header('x-api-user');
  const secret = c.req.header('x-api-secret');
  if (isValidCredential(user, secret)) {
    c.set('authUser', user?.trim());
    return next();
  }

  return failure(c, 'AUTH_INVALID', 'Autenticação inválida. Use Authorization: Bearer <accessToken> ou x-api-user=demo_user e x-api-secret=demo_secret.', 401, {
    bearer: bearerValidation.reason,
    acceptedMethods: ['Authorization: Bearer <accessToken>', 'x-api-user + x-api-secret']
  });
};
