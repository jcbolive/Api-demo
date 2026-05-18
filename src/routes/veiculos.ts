import { Hono } from 'hono';
import type { ApiEnv } from '../types/api';
import { veiculos } from '../mocks/data';
import { availabilityWindow, agendamentoResultado } from '../services/mock-service';
import { protocol } from '../utils/random';
import { success, failure } from '../utils/response';

export const veiculosRoutes = new Hono<ApiEnv>()
  .get('/placa/:placa', (c) => {
    const veiculo = veiculos.find((item) => item.placa.toLowerCase() === c.req.param('placa').toLowerCase());
    if (!veiculo) return failure(c, 'NOT_FOUND', 'Veículo não encontrado para a placa informada.', 404);
    return success(c, veiculo);
  })
  .get('/revisoes/datas-disponiveis', (c) => success(c, { filtros: { concessionaria: c.req.query('concessionaria'), periodo: c.req.query('periodo'), tipoRevisao: c.req.query('tipoRevisao') }, disponibilidade: availabilityWindow() }))
  .post('/revisoes/agendar', async (c) => {
    const payload = await c.req.json().catch(() => ({}));
    const resultado = agendamentoResultado(payload, c);
    if (resultado === 'agenda_cheia') return failure(c, 'SCHEDULE_FULL', 'Agenda da concessionária cheia para o período solicitado.', 409);
    if (resultado === 'conflito_horario') return failure(c, 'SCHEDULE_CONFLICT', 'Horário acabou de ser reservado por outro cliente.', 409);
    if (resultado === 'indisponibilidade') return failure(c, 'BACKEND_UNAVAILABLE', 'Sistema de oficina indisponível.', 503);
    return success(c, { id: protocol('REV'), status: 'agendado', payload, confirmacao: 'Revisão agendada e notificação enviada.' }, 201);
  });
