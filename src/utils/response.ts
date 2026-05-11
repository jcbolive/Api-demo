import type { Context } from 'hono';
import type { ApiEnv, ApiErrorCode, ErrorEnvelope, SuccessEnvelope } from '../types/api';

export const success = <T>(c: Context<ApiEnv>, data: T, status = 200, meta?: Record<string, unknown>) => {
  const body: SuccessEnvelope<T> = {
    success: true,
    requestId: c.get('requestId'),
    timestamp: new Date().toISOString(),
    data,
    ...(meta ? { meta } : {})
  };
  return c.json(body, status as never);
};

export const failure = (
  c: Context<ApiEnv>,
  code: ApiErrorCode,
  message: string,
  status = 500,
  details?: Record<string, unknown>
) => {
  const body: ErrorEnvelope = {
    success: false,
    requestId: c.get('requestId'),
    timestamp: new Date().toISOString(),
    error: {
      code,
      message,
      ...(details ? { details } : {})
    }
  };
  return c.json(body, status as never);
};
