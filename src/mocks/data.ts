import { dateTime, futureDate } from '../utils/random';

export const clientes = [
  { id: 'cli-001', nome: 'Mariana Costa', cpf: '12345678901', telefone: '+5511999990001', email: 'mariana.costa@example.com', endereco: { rua: 'Av. Paulista', numero: '1000', cidade: 'São Paulo', uf: 'SP', cep: '01310-100' }, status: 'ativo', contratoIds: ['ctr-001', 'ctr-002'], planoIds: ['pln-odonto-premium', 'pln-auto-care'] },
  { id: 'cli-002', nome: 'Rafael Almeida', cpf: '22233344455', telefone: '+5521999990002', email: 'rafael.almeida@example.com', endereco: { rua: 'Rua das Laranjeiras', numero: '88', cidade: 'Rio de Janeiro', uf: 'RJ', cep: '22240-003' }, status: 'sem_contrato', contratoIds: [], planoIds: [] },
  { id: 'cli-003', nome: 'Beatriz Souza', cpf: '33344455566', telefone: '+5531999990003', email: 'beatriz.souza@example.com', endereco: { rua: 'Av. Afonso Pena', numero: '2500', cidade: 'Belo Horizonte', uf: 'MG', cep: '30130-007' }, status: 'ativo', contratoIds: ['ctr-003'], planoIds: ['pln-saude-plus'] }
] as const;

export const contratos = [
  { id: 'ctr-001', clienteId: 'cli-001', produto: 'Proteção Veicular Premium', status: 'ativo', dataAdesao: '2024-01-15', vencimento: futureDate(8), valor: 189.9 },
  { id: 'ctr-002', clienteId: 'cli-001', produto: 'Plano Odontológico Premium', status: 'ativo', dataAdesao: '2023-08-01', vencimento: futureDate(15), valor: 79.9 },
  { id: 'ctr-003', clienteId: 'cli-003', produto: 'Saúde Família Plus', status: 'bloqueado', dataAdesao: '2022-11-20', vencimento: futureDate(-3), valor: 349.9 }
] as const;

export const planos = [
  { id: 'pln-odonto-premium', nome: 'Odonto Premium', categoria: 'saúde', cobertura: ['Clínico geral', 'Ortodontia', 'Urgência 24h'] },
  { id: 'pln-auto-care', nome: 'Auto Care', categoria: 'concessionária', cobertura: ['Revisão', 'Guincho', 'Check-up'] },
  { id: 'pln-saude-plus', nome: 'Saúde Família Plus', categoria: 'hospital', cobertura: ['Consultas', 'Exames', 'Telemedicina'] }
] as const;

export const historicos = [
  { clienteId: 'cli-001', protocolo: 'PRT-2026-100001', canal: 'whatsapp', data: '2026-05-08T10:30:00Z', status: 'resolvido', observacao: 'Segunda via enviada via WhatsApp.' },
  { clienteId: 'cli-001', protocolo: 'PRT-2026-100002', canal: 'zendesk', data: '2026-05-09T14:12:00Z', status: 'em_andamento', observacao: 'Cliente solicitou alteração de vencimento.' },
  { clienteId: 'cli-003', protocolo: 'PRT-2026-100003', canal: 'aws-connect', data: '2026-05-07T09:00:00Z', status: 'pendente', observacao: 'Financeiro em análise.' }
] as const;

export const veiculos = [
  { placa: 'ABC1D23', veiculo: 'SUV', modelo: 'Horizon XLT', ano: 2024, chassi: '9BWZZZ377VT004251', revisoes: [{ data: '2025-12-10', km: 10000, status: 'concluida' }], garantia: { status: 'ativa', ate: '2027-01-15' }, proprietario: clientes[0] },
  { placa: 'XYZ9A88', veiculo: 'Sedan', modelo: 'Aurora LX', ano: 2022, chassi: '8ADZZZ377VT009999', revisoes: [], garantia: { status: 'expirada', ate: '2025-02-01' }, proprietario: clientes[2] }
] as const;

export const especialidades = [
  { id: 'esp-cardio', nome: 'Cardiologia', planos: ['pln-saude-plus'] },
  { id: 'esp-dermato', nome: 'Dermatologia', planos: ['pln-saude-plus'] },
  { id: 'esp-ortopedia', nome: 'Ortopedia', planos: ['pln-saude-plus', 'pln-auto-care'] }
] as const;

export const medicos = [
  { id: 'med-001', nome: 'Dra. Helena Martins', especialidadeId: 'esp-cardio', crm: 'CRM-SP 123456', avaliacao: 4.9, unidade: 'Hospital Central', agenda: [dateTime(2, 9), dateTime(4, 14)] },
  { id: 'med-002', nome: 'Dr. Pedro Nogueira', especialidadeId: 'esp-dermato', crm: 'CRM-RJ 654321', avaliacao: 4.7, unidade: 'Unidade Barra', agenda: [dateTime(3, 10), dateTime(5, 16)] },
  { id: 'med-003', nome: 'Dra. Ana Ribeiro', especialidadeId: 'esp-ortopedia', crm: 'CRM-MG 111222', avaliacao: 4.8, unidade: 'Clínica Savassi', agenda: [dateTime(1, 11), dateTime(6, 15)] }
] as const;

export const unidades = ['Hospital Central', 'Unidade Barra', 'Clínica Savassi', 'Concessionária Paulista', 'Concessionária Norte'] as const;
