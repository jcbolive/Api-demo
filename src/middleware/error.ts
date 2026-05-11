import type { Context } from 'hono';
import type { ApiEnv } from '../types/api';
import { failure } from '../utils/response';

export const notFoundHandler = (c: Context<ApiEnv>) => failure(c, 'NOT_FOUND', 'Endpoint não encontrado na Mock API Platform.', 404);

export const errorHandler = (err: Error, c: Context<ApiEnv>) => {
  console.error(JSON.stringify({ requestId: c.get('requestId'), error: err.message, stack: err.stack }));
  return failure(c, 'INTERNAL_ERROR', 'Erro interno simulado ou não tratado.', 500, { reason: err.message });
};
