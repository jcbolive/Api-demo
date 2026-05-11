export const openApiYaml = `openapi: 3.0.3
info:
  title: Mock API Platform
  version: 1.0.0
  description: Plataforma enterprise de APIs mockadas para demos omnichannel, Zendesk, Cognigy, AWS Connect, IA, copilots e testes frontend.
servers:
  - url: https://mock-api-platform.workers.dev/api/v1
    description: Cloudflare Workers demo
  - url: http://localhost:8787/api/v1
    description: Wrangler local
security:
  - ApiUser: []
    ApiSecret: []
tags:
  - name: System
  - name: Auth
  - name: Clientes
  - name: Contratos
  - name: Veículos
  - name: Saúde
  - name: Agendamentos
  - name: Atendimento
paths:
  /health:
    get:
      tags: [System]
      security: []
      summary: Health check
      responses:
        '200': { $ref: '#/components/responses/Success' }
  /version:
    get:
      tags: [System]
      security: []
      summary: Versão da plataforma
      responses:
        '200': { $ref: '#/components/responses/Success' }
  /auth/token:
    post:
      tags: [Auth]
      security: []
      summary: Emite JWT fake usando x-api-user e x-api-secret
      parameters:
        - $ref: '#/components/parameters/ApiUser'
        - $ref: '#/components/parameters/ApiSecret'
      requestBody:
        content:
          application/json:
            schema: { type: object, properties: { user: { type: string, example: demo_user }, secret: { type: string, example: demo_secret } } }
      responses:
        '200': { $ref: '#/components/responses/Success' }
        '401': { $ref: '#/components/responses/Unauthorized' }
  /auth/refresh:
    post:
      tags: [Auth]
      security: []
      summary: Renova token fake
      responses:
        '200': { $ref: '#/components/responses/Success' }
  /clientes/cpf/{cpf}:
    get:
      tags: [Clientes]
      summary: Consulta cliente por CPF com cenários dinâmicos
      parameters:
        - $ref: '#/components/parameters/Cpf'
        - $ref: '#/components/parameters/Scenario'
      responses:
        '200': { $ref: '#/components/responses/Success' }
        '401': { $ref: '#/components/responses/Unauthorized' }
        '504': { $ref: '#/components/responses/Timeout' }
  /clientes/{clienteId}:
    get:
      tags: [Clientes]
      summary: Consulta cliente por ID
      parameters: [ { $ref: '#/components/parameters/ClienteId' } ]
      responses:
        '200': { $ref: '#/components/responses/Success' }
        '404': { $ref: '#/components/responses/NotFound' }
  /clientes/{clienteId}/contratos:
    get:
      tags: [Clientes]
      summary: Lista contratos do cliente
      parameters: [ { $ref: '#/components/parameters/ClienteId' } ]
      responses: { '200': { $ref: '#/components/responses/Success' } }
  /clientes/{clienteId}/planos:
    get:
      tags: [Clientes]
      summary: Lista planos do cliente
      parameters: [ { $ref: '#/components/parameters/ClienteId' } ]
      responses: { '200': { $ref: '#/components/responses/Success' } }
  /clientes/{clienteId}/historico:
    get:
      tags: [Clientes]
      summary: Histórico omnichannel do cliente
      parameters: [ { $ref: '#/components/parameters/ClienteId' } ]
      responses: { '200': { $ref: '#/components/responses/Success' } }
  /contratos/{contratoId}:
    get:
      tags: [Contratos]
      summary: Consulta contrato
      parameters: [ { $ref: '#/components/parameters/ContratoId' } ]
      responses: { '200': { $ref: '#/components/responses/Success' }, '404': { $ref: '#/components/responses/NotFound' } }
  /contratos/{contratoId}/financeiro:
    get:
      tags: [Contratos]
      summary: Status financeiro randômico
      parameters: [ { $ref: '#/components/parameters/ContratoId' } ]
      responses: { '200': { $ref: '#/components/responses/Success' } }
  /contratos/{contratoId}/segunda-via:
    get:
      tags: [Contratos]
      summary: Segunda via de boleto mockada
      parameters: [ { $ref: '#/components/parameters/ContratoId' } ]
      responses: { '200': { $ref: '#/components/responses/Success' } }
  /veiculos/placa/{placa}:
    get:
      tags: [Veículos]
      summary: Consulta veículo por placa
      parameters: [ { name: placa, in: path, required: true, schema: { type: string }, example: ABC1D23 } ]
      responses: { '200': { $ref: '#/components/responses/Success' }, '404': { $ref: '#/components/responses/NotFound' } }
  /veiculos/revisoes/datas-disponiveis:
    get:
      tags: [Veículos]
      summary: Datas disponíveis para revisão
      parameters:
        - { name: concessionaria, in: query, schema: { type: string } }
        - { name: periodo, in: query, schema: { type: string } }
        - { name: tipoRevisao, in: query, schema: { type: string } }
      responses: { '200': { $ref: '#/components/responses/Success' } }
  /veiculos/revisoes/agendar:
    post:
      tags: [Veículos]
      summary: Agenda revisão e simula conflitos
      requestBody: { $ref: '#/components/requestBodies/Agendamento' }
      responses: { '201': { $ref: '#/components/responses/Success' }, '409': { $ref: '#/components/responses/Conflict' }, '503': { $ref: '#/components/responses/Unavailable' } }
  /especialidades:
    get:
      tags: [Saúde]
      summary: Lista especialidades
      responses: { '200': { $ref: '#/components/responses/Success' } }
  /especialidades/plano/{planoId}:
    get:
      tags: [Saúde]
      summary: Especialidades por plano
      parameters: [ { name: planoId, in: path, required: true, schema: { type: string }, example: pln-saude-plus } ]
      responses: { '200': { $ref: '#/components/responses/Success' } }
  /medicos/especialidade/{especialidadeId}:
    get:
      tags: [Saúde]
      summary: Médicos por especialidade
      parameters: [ { name: especialidadeId, in: path, required: true, schema: { type: string }, example: esp-cardio } ]
      responses: { '200': { $ref: '#/components/responses/Success' } }
  /consultas/agendar:
    post:
      tags: [Saúde]
      summary: Agenda consulta médica
      requestBody: { $ref: '#/components/requestBodies/Agendamento' }
      responses: { '201': { $ref: '#/components/responses/Success' }, '409': { $ref: '#/components/responses/Conflict' }, '503': { $ref: '#/components/responses/Unavailable' } }
  /consultas/datas-disponiveis:
    get:
      tags: [Saúde]
      summary: Datas disponíveis para consulta
      parameters: [ { $ref: '#/components/parameters/Scenario' } ]
      responses: { '200': { $ref: '#/components/responses/Success' } }
  /consultas/horarios-disponiveis:
    get:
      tags: [Saúde]
      summary: Horários disponíveis para consulta
      responses: { '200': { $ref: '#/components/responses/Success' } }
  /agendamentos/datas-disponiveis:
    get:
      tags: [Agendamentos]
      summary: Datas disponíveis por unidade e serviço
      responses: { '200': { $ref: '#/components/responses/Success' } }
  /agendamentos/horarios-disponiveis:
    get:
      tags: [Agendamentos]
      summary: Horários disponíveis
      responses: { '200': { $ref: '#/components/responses/Success' } }
  /agendamentos:
    post:
      tags: [Agendamentos]
      summary: Cria agendamento genérico
      requestBody: { $ref: '#/components/requestBodies/Agendamento' }
      responses: { '201': { $ref: '#/components/responses/Success' }, '409': { $ref: '#/components/responses/Conflict' }, '503': { $ref: '#/components/responses/Unavailable' } }
  /agendamentos/{id}:
    delete:
      tags: [Agendamentos]
      summary: Cancela agendamento
      parameters: [ { name: id, in: path, required: true, schema: { type: string } } ]
      responses: { '200': { $ref: '#/components/responses/Success' } }
  /atendimentos/{id}/status:
    get:
      tags: [Atendimento]
      summary: Status de atendimento omnichannel
      parameters: [ { name: id, in: path, required: true, schema: { type: string }, example: ATD-123 } ]
      responses: { '200': { $ref: '#/components/responses/Success' } }
  /notificacoes:
    post:
      tags: [Atendimento]
      summary: Envia notificação mockada WhatsApp, SMS, e-mail ou push
      requestBody:
        content:
          application/json:
            schema: { type: object, properties: { canal: { type: string, enum: [whatsapp, sms, email, push] }, destino: { type: string }, mensagem: { type: string } } }
      responses: { '202': { $ref: '#/components/responses/Success' } }
components:
  securitySchemes:
    ApiUser: { type: apiKey, in: header, name: x-api-user }
    ApiSecret: { type: apiKey, in: header, name: x-api-secret }
  parameters:
    ApiUser: { name: x-api-user, in: header, required: true, schema: { type: string }, example: demo_user }
    ApiSecret: { name: x-api-secret, in: header, required: true, schema: { type: string }, example: demo_secret }
    Scenario: { name: scenario, in: query, required: false, schema: { type: string, enum: [success, empty, timeout, unavailable, error, slow] }, description: Força comportamento mockado. }
    Cpf: { name: cpf, in: path, required: true, schema: { type: string }, example: '12345678901' }
    ClienteId: { name: clienteId, in: path, required: true, schema: { type: string }, example: cli-001 }
    ContratoId: { name: contratoId, in: path, required: true, schema: { type: string }, example: ctr-001 }
  requestBodies:
    Agendamento:
      content:
        application/json:
          schema:
            type: object
            properties:
              unidade: { type: string, example: Hospital Central }
              servico: { type: string, example: Consulta Cardiologia }
              data: { type: string, example: '2026-05-15' }
              horario: { type: string, example: '09:30' }
  responses:
    Success:
      description: Resposta padronizada de sucesso
      content:
        application/json:
          schema: { $ref: '#/components/schemas/SuccessEnvelope' }
          examples:
            sucesso: { value: { success: true, requestId: REQ-123456, timestamp: '2026-05-09T14:00:00Z', data: {} } }
            vazio: { value: { success: true, requestId: REQ-123456, timestamp: '2026-05-09T14:00:00Z', data: [] } }
    Unauthorized: { description: Não autenticado, content: { application/json: { schema: { $ref: '#/components/schemas/ErrorEnvelope' } } } }
    NotFound: { description: Não encontrado, content: { application/json: { schema: { $ref: '#/components/schemas/ErrorEnvelope' } } } }
    Conflict: { description: Conflito de agenda, content: { application/json: { schema: { $ref: '#/components/schemas/ErrorEnvelope' } } } }
    Timeout: { description: Timeout simulado, content: { application/json: { schema: { $ref: '#/components/schemas/ErrorEnvelope' } } } }
    Unavailable: { description: Backend indisponível, content: { application/json: { schema: { $ref: '#/components/schemas/ErrorEnvelope' } } } }
  schemas:
    SuccessEnvelope:
      type: object
      required: [success, requestId, timestamp, data]
      properties:
        success: { type: boolean, example: true }
        requestId: { type: string, example: REQ-123456 }
        timestamp: { type: string, format: date-time, example: '2026-05-09T14:00:00Z' }
        data: { type: object }
        meta: { type: object }
    ErrorEnvelope:
      type: object
      required: [success, requestId, timestamp, error]
      properties:
        success: { type: boolean, example: false }
        requestId: { type: string, example: REQ-123456 }
        timestamp: { type: string, format: date-time, example: '2026-05-09T14:00:00Z' }
        error:
          type: object
          required: [code, message]
          properties:
            code: { type: string, example: AUTH_INVALID }
            message: { type: string, example: Descrição do erro }
            details: { type: object }
    Pagination:
      type: object
      properties:
        page: { type: integer, example: 1 }
        pageSize: { type: integer, example: 20 }
        total: { type: integer, example: 100 }
    Timeout:
      allOf: [ { $ref: '#/components/schemas/ErrorEnvelope' } ]
    Unavailable:
      allOf: [ { $ref: '#/components/schemas/ErrorEnvelope' } ]
`;
