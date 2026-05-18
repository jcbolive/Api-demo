import { Hono } from 'hono';
import type { ApiEnv } from '../types/api';
import { especialidades, medicos } from '../mocks/data';
import { agendamentoResultado, datasDisponiveis, horariosDisponiveis } from '../services/mock-service';
import { protocol } from '../utils/random';
import { failure, success } from '../utils/response';
import { queryParams } from '../utils/query';

export const saudeRoutes = new Hono<ApiEnv>()
  .get('/especialidades', (c) => success(c, especialidades))
  .get('/especialidades/plano/:planoId', (c) => success(c, especialidades.filter((especialidade) => (especialidade.planos as readonly string[]).includes(c.req.param('planoId')))))
  .get('/medicos/especialidade/:especialidadeId', (c) => success(c, medicos.filter((medico) => medico.especialidadeId === c.req.param('especialidadeId'))))
  .get('/consultas/datas-disponiveis', (c) => success(c, { filtros: queryParams(c.req.url), datas: datasDisponiveis() }))
  .get('/consultas/horarios-disponiveis', (c) => success(c, { filtros: queryParams(c.req.url), horarios: horariosDisponiveis() }))
  .post('/consultas/agendar', async (c) => {
    const payload = await c.req.json().catch(() => ({}));
    const resultado = agendamentoResultado(payload, c);
    if (resultado === 'agenda_cheia') return failure(c, 'SCHEDULE_FULL', 'Não há vagas para consulta no período solicitado.', 409);
    if (resultado === 'conflito_horario') return failure(c, 'SCHEDULE_CONFLICT', 'Conflito de horário detectado para o médico selecionado.', 409);
    if (resultado === 'indisponibilidade') return failure(c, 'BACKEND_UNAVAILABLE', 'Sistema hospitalar momentaneamente indisponível.', 503);
    return success(c, { id: protocol('CON'), status: 'confirmada', payload, telemedicinaDisponivel: true }, 201);
  });
