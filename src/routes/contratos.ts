import { Hono } from 'hono';
import type { ApiEnv } from '../types/api';
import { failure, success } from '../utils/response';
import { contratoById, financeiro, segundaVia } from '../services/mock-service';

export const contratosRoutes = new Hono<ApiEnv>()
  .get('/:contratoId', (c) => {
    const contrato = contratoById(c.req.param('contratoId'));
    if (!contrato) return failure(c, 'NOT_FOUND', 'Contrato não encontrado.', 404);
    return success(c, contrato);
  })
  .get('/:contratoId/financeiro', (c) => success(c, financeiro(c.req.param('contratoId'))))
  .get('/:contratoId/segunda-via', (c) => success(c, segundaVia(c.req.param('contratoId'))));
