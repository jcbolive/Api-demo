import { Hono } from 'hono';
import type { ApiEnv } from '../types/api';
import { atendimentoStatus } from '../services/mock-service';
import { pick, protocol } from '../utils/random';
import { success } from '../utils/response';

export const atendimentoRoutes = new Hono<ApiEnv>()
  .get('/atendimentos/:id/status', (c) => success(c, atendimentoStatus(c.req.param('id'))))
  .post('/notificacoes', async (c) => {
    const payload = await c.req.json().catch(() => ({}));
    const canal = payload.canal ?? pick(['whatsapp', 'sms', 'email', 'push'] as const);
    return success(c, { id: protocol('NTF'), canal, status: pick(['enviado', 'enfileirado', 'entregue'] as const), providerMessageId: protocol('MSG'), payload }, 202);
  });
