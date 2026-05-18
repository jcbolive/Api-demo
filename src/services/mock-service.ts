import type { Context } from 'hono';
import type { ApiEnv, AppointmentScenario } from '../types/api';
import { pick, randomInt, futureDate, dateTime, protocol } from '../utils/random';
import { contratos } from '../mocks/data';

export const scenarioMeta = (c: Context<ApiEnv>) => ({ scenario: c.req.query('scenario') ?? 'dynamic', generatedAt: new Date().toISOString() });

export const financeiro = (contratoId: string) => ({
  contratoId,
  statusFinanceiro: pick(['adimplente', 'inadimplente', 'parcelado', 'bloqueado'] as const),
  parcelasAbertas: randomInt(0, 4),
  valorEmAberto: Number((Math.random() * 900).toFixed(2)),
  negociacaoDisponivel: Math.random() > 0.35
});

export const segundaVia = (contratoId: string) => ({
  contratoId,
  linhaDigitavel: `34191.79001 01043.510047 91020.150008 ${randomInt(1, 9)} ${randomInt(10000000000000, 99999999999999)}`,
  codigoBarras: `${randomInt(1000000000000000, 9999999999999999)}${randomInt(1000000000000000, 9999999999999999)}`,
  vencimento: futureDate(randomInt(1, 10)),
  pdfUrl: `https://mock-api-platform.example.com/pdfs/boletos/${contratoId}.pdf`
});

export const datasDisponiveis = (count = 6) => Array.from({ length: count }, (_, index) => ({ data: futureDate(index + 1), vagas: randomInt(0, 8), periodo: pick(['manha', 'tarde', 'noite'] as const) }));

export const horariosDisponiveis = () => ['08:00', '09:30', '11:00', '14:00', '15:30', '17:00'].map((hora) => ({ hora, disponivel: Math.random() > 0.25 }));

const appointmentScenarios = ['sucesso', 'agenda_cheia', 'conflito_horario', 'indisponibilidade'] as const;

const isAppointmentScenario = (value: unknown): value is AppointmentScenario => typeof value === 'string' && (appointmentScenarios as readonly string[]).includes(value);

const payloadRecord = (payload: unknown): Record<string, unknown> => payload && typeof payload === 'object' && !Array.isArray(payload) ? payload as Record<string, unknown> : {};

export const agendamentoResultado = (payload: unknown): AppointmentScenario => {
  const body = payloadRecord(payload);
  const scenario = body.cenario ?? body.scenario ?? body.resultado ?? body.mockScenario;
  return isAppointmentScenario(scenario) ? scenario : 'sucesso';
};

export const atendimentoStatus = (id: string) => ({
  id,
  protocolo: protocol('ATD'),
  canal: pick(['whatsapp', 'sms', 'email', 'push', 'chat', 'voice', 'zendesk', 'aws-connect', 'cognigy'] as const),
  fila: pick(['financeiro', 'suporte_n1', 'agendamento', 'retenção', 'vendas'] as const),
  atendente: pick(['Copilot IA', 'Fernanda Lima', 'Lucas Pereira', 'Bot Cognigy'] as const),
  sla: { prioridade: pick(['baixa', 'media', 'alta'] as const), limiteMinutos: randomInt(15, 240), restanteMinutos: randomInt(0, 180) },
  status: pick(['novo', 'em_atendimento', 'aguardando_cliente', 'resolvido', 'escalado'] as const)
});

export const contratoById = (id: string) => contratos.find((contrato) => contrato.id === id);
export const availabilityWindow = () => ({ inicio: dateTime(1, 8), fim: dateTime(14, 18), datas: datasDisponiveis() });
