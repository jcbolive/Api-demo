import { Hono } from 'hono';
import type { ApiEnv } from '../types/api';
import { createFakeJwt, isValidCredential } from '../auth/users';
import { success, failure } from '../utils/response';

export const authRoutes = new Hono<ApiEnv>()
  .post('/token', async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const user = c.req.header('x-api-user') ?? body.user;
    const secret = c.req.header('x-api-secret') ?? body.secret;
    if (!isValidCredential(user, secret)) return failure(c, 'AUTH_INVALID', 'Credenciais inválidas para emissão de token.', 401);
    return success(c, { accessToken: createFakeJwt(user), tokenType: 'Bearer', expiresIn: 3600, scope: ['mock:read', 'mock:write'] });
  })
  .post('/refresh', async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const subject = body.subject ?? c.req.header('x-api-user') ?? 'demo_user';
    return success(c, { accessToken: createFakeJwt(subject), tokenType: 'Bearer', expiresIn: 3600, refreshed: true });
  });
