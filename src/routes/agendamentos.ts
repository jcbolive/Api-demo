import { Hono } from 'hono';
import type { ApiEnv } from '../types/api';
import { agendamentoResultado, datasDisponiveis, horariosDisponiveis } from '../services/mock-service';
import { protocol } from '../utils/random';
import { failure, success } from '../utils/response';
import { queryParams } from '../utils/query';

export const agendamentosRoutes = new Hono<ApiEnv>()
  .get('/datas-disponiveis', (c) => success(c, { filtros: queryParams(c.req.url), datas: datasDisponiveis(8) }))
  .get('/horarios-disponiveis', (c) => success(c, { filtros: queryParams(c.req.url), tempoMedioAtendimentoMinutos: Number(c.req.query('tempoMedioAtendimento') ?? 30), horarios: horariosDisponiveis() }))
  .post('/', async (c) => {
    const payload = await c.req.json().catch(() => ({}));
    const resultado = agendamentoResultado();
    if (resultado === 'agenda_cheia') return failure(c, 'SCHEDULE_FULL', 'Agenda cheia para unidade e serviço selecionados.', 409);
    if (resultado === 'conflito_horario') return failure(c, 'SCHEDULE_CONFLICT', 'Conflito com outro agendamento existente.', 409);
    if (resultado === 'indisponibilidade') return failure(c, 'BACKEND_UNAVAILABLE', 'Motor de agenda indisponível.', 503);
    return success(c, { id: protocol('AGE'), status: 'agendado', payload }, 201);
  })
  .delete('/:id', (c) => success(c, { id: c.req.param('id'), status: 'cancelado', mensagem: 'Agendamento cancelado com sucesso.' }));
