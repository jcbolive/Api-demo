import { Hono } from 'hono';
import type { ApiEnv } from '../types/api';
import { clientes, contratos, historicos, planos } from '../mocks/data';
import { pick } from '../utils/random';
import { success, failure } from '../utils/response';
import { getScenario } from '../utils/scenario';

export const clientesRoutes = new Hono<ApiEnv>()
  .get('/cpf/:cpf', (c) => {
    if (getScenario(c) === 'empty') return success(c, { cliente: null, situacao: 'cliente_inexistente' });
    const cpf = c.req.param('cpf');
    const cliente = clientes.find((item) => item.cpf === cpf) ?? pick([...clientes, undefined] as const);
    if (!cliente) return success(c, { cliente: null, situacao: 'cliente_inexistente' });
    const clienteContratos = contratos.filter((contrato) => contrato.clienteId === cliente.id);
    return success(c, { cliente, situacao: clienteContratos.length === 0 ? 'cliente_sem_contrato' : clienteContratos.length === 1 ? 'cliente_com_1_contrato' : 'cliente_multiplos_contratos', contratos: clienteContratos });
  })
  .get('/:clienteId', (c) => {
    const cliente = clientes.find((item) => item.id === c.req.param('clienteId'));
    if (!cliente) return failure(c, 'NOT_FOUND', 'Cliente não encontrado.', 404);
    return success(c, cliente);
  })
  .get('/:clienteId/contratos', (c) => success(c, contratos.filter((contrato) => contrato.clienteId === c.req.param('clienteId'))))
  .get('/:clienteId/planos', (c) => {
    const cliente = clientes.find((item) => item.id === c.req.param('clienteId'));
    return success(c, planos.filter((plano) => cliente ? [...cliente.planoIds].includes(plano.id) : false));
  })
  .get('/:clienteId/historico', (c) => success(c, historicos.filter((historico) => historico.clienteId === c.req.param('clienteId')), 200, { canais: ['whatsapp', 'zendesk', 'aws-connect', 'cognigy'] }));
