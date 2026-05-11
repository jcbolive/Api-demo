import { Hono } from 'hono';
import type { ApiEnv } from '../types/api';
import { success } from '../utils/response';

export const systemRoutes = new Hono<ApiEnv>()
  .get('/health', (c) => success(c, { status: 'ok', uptime: 'serverless', dependencies: { mockEngine: 'healthy', openapi: 'healthy' } }))
  .get('/version', (c) => success(c, { name: 'mock-api-platform', version: c.env.API_VERSION ?? '1.0.0', environment: c.env.ENVIRONMENT ?? 'demo', runtime: 'cloudflare-workers' }));
