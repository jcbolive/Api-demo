import type { Context, Next } from 'hono';
import type { ApiEnv, Scenario } from '../types/api';
import { randomInt } from './random';
import { failure } from './response';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getScenario = (c: Context<ApiEnv>): Scenario | undefined => {
  const scenario = c.req.query('scenario') ?? c.req.header('x-mock-scenario');
  if (!scenario) return undefined;
  if (['success', 'empty', 'timeout', 'unavailable', 'error', 'slow'].includes(scenario)) return scenario as Scenario;
  return undefined;
};

export const applyScenario = async (c: Context<ApiEnv>, next: Next) => {
  const scenario = getScenario(c);
  if (scenario === 'timeout') {
    await sleep(2200);
    return failure(c, 'TIMEOUT', 'Tempo limite simulado ao consultar backend legado.', 504, { retryable: true });
  }
  if (scenario === 'unavailable') return failure(c, 'BACKEND_UNAVAILABLE', 'Backend mockado indisponível.', 503, { retryAfterSeconds: 30 });
  if (scenario === 'error') return failure(c, 'INTEGRATION_ERROR', 'Erro simulado de integração enterprise.', 500);
  if (scenario === 'slow') await sleep(randomInt(900, 1800));
  return next();
};
