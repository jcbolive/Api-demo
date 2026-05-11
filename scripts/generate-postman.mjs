import { writeFileSync } from 'node:fs';

const baseUrl = '{{baseUrl}}/api/v1';
const headers = [
  { key: 'x-api-user', value: '{{apiUser}}' },
  { key: 'x-api-secret', value: '{{apiSecret}}' },
  { key: 'content-type', value: 'application/json' }
];

const endpoints = [
  ['System', 'GET', '/health', 'Health check', false],
  ['System', 'GET', '/version', 'Versão da plataforma', false],
  ['Auth', 'POST', '/auth/token', 'Emitir JWT fake', true],
  ['Auth', 'POST', '/auth/refresh', 'Renovar JWT fake', true],
  ['Clientes', 'GET', '/clientes/cpf/12345678901', 'Cliente por CPF', false],
  ['Clientes', 'GET', '/clientes/cli-001', 'Cliente por ID', false],
  ['Clientes', 'GET', '/clientes/cli-001/contratos', 'Contratos do cliente', false],
  ['Clientes', 'GET', '/clientes/cli-001/planos', 'Planos do cliente', false],
  ['Clientes', 'GET', '/clientes/cli-001/historico', 'Histórico omnichannel', false],
  ['Contratos', 'GET', '/contratos/ctr-001', 'Contrato por ID', false],
  ['Contratos', 'GET', '/contratos/ctr-001/financeiro', 'Financeiro do contrato', false],
  ['Contratos', 'GET', '/contratos/ctr-001/segunda-via', 'Segunda via', false],
  ['Veículos', 'GET', '/veiculos/placa/ABC1D23', 'Veículo por placa', false],
  ['Veículos', 'GET', '/veiculos/revisoes/datas-disponiveis?concessionaria=Paulista&periodo=manha&tipoRevisao=10000km', 'Datas para revisão', false],
  ['Veículos', 'POST', '/veiculos/revisoes/agendar', 'Agendar revisão', true],
  ['Saúde', 'GET', '/especialidades', 'Especialidades', false],
  ['Saúde', 'GET', '/especialidades/plano/pln-saude-plus', 'Especialidades por plano', false],
  ['Saúde', 'GET', '/medicos/especialidade/esp-cardio', 'Médicos por especialidade', false],
  ['Saúde', 'POST', '/consultas/agendar', 'Agendar consulta', true],
  ['Saúde', 'GET', '/consultas/datas-disponiveis?especialidade=esp-cardio&unidade=Hospital%20Central&periodo=manha&convenio=pln-saude-plus', 'Datas consulta', false],
  ['Saúde', 'GET', '/consultas/horarios-disponiveis?medico=med-001&data=2026-05-15', 'Horários consulta', false],
  ['Agendamentos', 'GET', '/agendamentos/datas-disponiveis?unidade=Hospital%20Central&servico=Triagem&periodo=manha', 'Datas disponíveis', false],
  ['Agendamentos', 'GET', '/agendamentos/horarios-disponiveis?unidade=Hospital%20Central&servico=Triagem&tempoMedioAtendimento=30', 'Horários disponíveis', false],
  ['Agendamentos', 'POST', '/agendamentos', 'Criar agendamento', true],
  ['Agendamentos', 'DELETE', '/agendamentos/AGE-123', 'Cancelar agendamento', false],
  ['Atendimento', 'GET', '/atendimentos/ATD-123/status', 'Status atendimento', false],
  ['Atendimento', 'POST', '/notificacoes', 'Enviar notificação', true]
];

const body = JSON.stringify({ unidade: 'Hospital Central', servico: 'Consulta Cardiologia', data: '2026-05-15', horario: '09:30', canal: 'whatsapp', destino: '+5511999990001', mensagem: 'Sua solicitação foi confirmada.', user: 'demo_user', secret: 'demo_secret' }, null, 2);
const groups = new Map();
for (const [folder, method, path, name, hasBody] of endpoints) {
  if (!groups.has(folder)) groups.set(folder, []);
  groups.get(folder).push({
    name,
    request: { method, header: path.startsWith('/health') || path.startsWith('/version') ? [] : headers, url: `${baseUrl}${path}`, ...(hasBody ? { body: { mode: 'raw', raw: body } } : {}) },
    response: [
      { name: 'sucesso', status: 'OK', code: method === 'POST' ? 201 : 200, body: JSON.stringify({ success: true, requestId: 'REQ-123456', timestamp: '2026-05-09T14:00:00Z', data: {} }, null, 2) },
      { name: 'erro', status: 'Internal Server Error', code: 500, body: JSON.stringify({ success: false, requestId: 'REQ-123456', timestamp: '2026-05-09T14:00:00Z', error: { code: 'INTEGRATION_ERROR', message: 'Erro simulado de integração enterprise.' } }, null, 2) },
      { name: 'timeout', status: 'Gateway Timeout', code: 504, body: JSON.stringify({ success: false, requestId: 'REQ-123456', timestamp: '2026-05-09T14:00:00Z', error: { code: 'TIMEOUT', message: 'Tempo limite simulado ao consultar backend legado.' } }, null, 2) },
      { name: 'vazio', status: 'OK', code: 200, body: JSON.stringify({ success: true, requestId: 'REQ-123456', timestamp: '2026-05-09T14:00:00Z', data: [] }, null, 2) }
    ]
  });
}

writeFileSync('postman/collection.json', `${JSON.stringify({ info: { name: 'Mock API Platform - Cloudflare Workers', schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json', description: 'Collection gerada a partir dos endpoints OpenAPI da plataforma mock.' }, item: [...groups.entries()].map(([name, item]) => ({ name, item })), variable: [{ key: 'baseUrl', value: 'http://localhost:8787' }, { key: 'apiUser', value: 'demo_user' }, { key: 'apiSecret', value: 'demo_secret' }] }, null, 2)}\n`);
writeFileSync('postman/environment.json', `${JSON.stringify({ name: 'Mock API Platform - Local', values: [{ key: 'baseUrl', value: 'http://localhost:8787', enabled: true }, { key: 'apiUser', value: 'demo_user', enabled: true }, { key: 'apiSecret', value: 'demo_secret', enabled: true }, { key: 'scenario', value: 'success', enabled: true }], _postman_variable_scope: 'environment' }, null, 2)}\n`);
console.log('Postman collection e environment gerados.');
