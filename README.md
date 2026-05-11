# Mock API Platform — Cloudflare Workers + Hono + TypeScript

Plataforma profissional de APIs mockadas para demonstrações comerciais, testes frontend, integrações omnichannel, Zendesk, Bots, Cognigy, AWS Connect, IA/LLMs, copilots e POCs enterprise.

## Visão geral

A API simula cenários reais de:

- **Concessionária**: veículos, revisões, garantia e agendamento de oficina.
- **Hospital / Saúde**: especialidades, médicos, agenda médica e consultas.
- **Serviços**: clientes, contratos, planos, financeiro e segunda via.
- **Atendimento Omnichannel**: status de atendimento, fila, SLA, notificações WhatsApp/SMS/e-mail/push.

Base path da API:

```text
/api/v1
```

Swagger UI:

```text
/docs
```

OpenAPI:

```text
/openapi/openapi.yaml
```

## Arquitetura

```text
src/
├── auth/          # credenciais fake e JWT fake
├── docs/          # Swagger UI
├── middleware/    # auth, delay, log, erro, requestId
├── mocks/         # massa fake consistente
├── openapi/       # spec embutida para servir no Worker
├── routes/        # rotas separadas por domínio
├── services/      # regras dinâmicas de mock
├── types/         # tipos TypeScript compartilhados
└── utils/         # envelope, randomização e cenários

openapi/openapi.yaml       # fonte principal da documentação
postman/collection.json    # collection pronta para import
postman/environment.json   # environment local
scripts/                   # validação OpenAPI e geração Postman
wrangler.toml              # deploy Cloudflare Workers
```

## Padrão de resposta

Sucesso:

```json
{
  "success": true,
  "requestId": "REQ-123456",
  "timestamp": "2026-05-09T14:00:00Z",
  "data": {}
}
```

Erro:

```json
{
  "success": false,
  "requestId": "REQ-123456",
  "timestamp": "2026-05-09T14:00:00Z",
  "error": {
    "code": "ERROR_CODE",
    "message": "Descrição do erro"
  }
}
```

A plataforma adiciona automaticamente:

- `requestId` aleatório (`REQ-######`) ou reaproveita `x-request-id`.
- `timestamp` em ISO-8601.
- headers padrão (`content-type`, `x-request-id`, `x-api-platform`).
- CORS liberado para demos e testes frontend.

## Autenticação fake

Envie os headers:

```text
x-api-user: dealer_user
x-api-secret: dealer_secret
```

Usuários válidos:

| Usuário | Secret | Uso sugerido |
|---|---|---|
| `dealer_user` | `dealer_secret` | Concessionária |
| `hospital_user` | `hospital_secret` | Saúde |
| `services_user` | `services_secret` | Serviços |

Sem credenciais válidas, endpoints protegidos retornam HTTP `401`.

### Token fake

```bash
curl -X POST http://localhost:8787/api/v1/auth/token \
  -H 'content-type: application/json' \
  -H 'x-api-user: dealer_user' \
  -H 'x-api-secret: dealer_secret'
```

### Refresh fake

```bash
curl -X POST http://localhost:8787/api/v1/auth/refresh \
  -H 'content-type: application/json' \
  -d '{"subject":"dealer_user"}'
```

## Cenários dinâmicos de mock

Qualquer endpoint em `/api/v1` pode receber:

```text
?scenario=success|empty|timeout|unavailable|error|slow
```

Ou header:

```text
x-mock-scenario: timeout
```

Cenários simulados:

- `success`: fluxo normal.
- `empty`: retorno vazio quando aplicável.
- `timeout`: delay e HTTP `504`.
- `unavailable`: HTTP `503`.
- `error`: HTTP `500`.
- `slow`: lentidão randômica.

Também é possível controlar delay:

```text
x-mock-delay-ms: 1000
```

## Instalação

```bash
npm install
npm run dev
```

Acesse:

- API local: `http://localhost:8787/api/v1`
- Swagger UI: `http://localhost:8787/docs`
- OpenAPI: `http://localhost:8787/openapi/openapi.yaml`

## Scripts

```bash
npm run dev              # inicia Wrangler local
npm run deploy           # publica no Cloudflare Workers
npm run build            # build de CI/Cloudflare: typecheck + validação OpenAPI
npm run typecheck        # valida TypeScript
npm run openapi:check    # valida presença de campos e paths principais
npm run postman:generate # regenera collection e environment
npm run check            # executa validações principais
```

## Deploy no Cloudflare Workers

1. Faça login no Wrangler:

```bash
npx wrangler login
```

2. Valide o projeto:

```bash
npm run check
```

3. Publique:

```bash
npm run deploy
```

O arquivo `wrangler.toml` já aponta para `src/index.ts` e define `compatibility_date`.

### Deploy via Git no painel da Cloudflare

Se você conectou o repositório GitHub em **Workers & Pages**, configure o build assim:

| Campo | Valor |
|---|---|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` ou `npm run deploy` |
| Wrangler config | `wrangler.toml` |
| Root directory | `/` |

O script `build` existe para o pipeline da Cloudflare validar TypeScript e OpenAPI antes do deploy. Ele não gera pasta `dist`, porque Cloudflare Workers publica diretamente o entrypoint definido em `wrangler.toml`.

## Endpoints principais

### System

- `GET /api/v1/health`
- `GET /api/v1/version`

### Clientes

- `GET /api/v1/clientes/cpf/{cpf}`
- `GET /api/v1/clientes/{clienteId}`
- `GET /api/v1/clientes/{clienteId}/contratos`
- `GET /api/v1/clientes/{clienteId}/planos`
- `GET /api/v1/clientes/{clienteId}/historico`

### Contratos

- `GET /api/v1/contratos/{contratoId}`
- `GET /api/v1/contratos/{contratoId}/financeiro`
- `GET /api/v1/contratos/{contratoId}/segunda-via`

### Veículos

- `GET /api/v1/veiculos/placa/{placa}`
- `GET /api/v1/veiculos/revisoes/datas-disponiveis`
- `POST /api/v1/veiculos/revisoes/agendar`

### Saúde

- `GET /api/v1/especialidades`
- `GET /api/v1/especialidades/plano/{planoId}`
- `GET /api/v1/medicos/especialidade/{especialidadeId}`
- `POST /api/v1/consultas/agendar`
- `GET /api/v1/consultas/datas-disponiveis`
- `GET /api/v1/consultas/horarios-disponiveis`

### Agendamentos

- `GET /api/v1/agendamentos/datas-disponiveis`
- `GET /api/v1/agendamentos/horarios-disponiveis`
- `POST /api/v1/agendamentos`
- `DELETE /api/v1/agendamentos/{id}`

### Atendimento

- `GET /api/v1/atendimentos/{id}/status`
- `POST /api/v1/notificacoes`

## Exemplos curl

### Health

```bash
curl http://localhost:8787/api/v1/health
```

### Cliente com múltiplos contratos

```bash
curl http://localhost:8787/api/v1/clientes/cpf/12345678901 \
  -H 'x-api-user: dealer_user' \
  -H 'x-api-secret: dealer_secret'
```

### Cliente inexistente / retorno vazio

```bash
curl 'http://localhost:8787/api/v1/clientes/cpf/00000000000?scenario=empty' \
  -H 'x-api-user: services_user' \
  -H 'x-api-secret: services_secret'
```

### Simular timeout

```bash
curl 'http://localhost:8787/api/v1/contratos/ctr-001/financeiro?scenario=timeout' \
  -H 'x-api-user: services_user' \
  -H 'x-api-secret: services_secret'
```

### Segunda via

```bash
curl http://localhost:8787/api/v1/contratos/ctr-001/segunda-via \
  -H 'x-api-user: services_user' \
  -H 'x-api-secret: services_secret'
```

### Datas disponíveis para revisão

```bash
curl 'http://localhost:8787/api/v1/veiculos/revisoes/datas-disponiveis?concessionaria=Paulista&periodo=manha&tipoRevisao=10000km' \
  -H 'x-api-user: dealer_user' \
  -H 'x-api-secret: dealer_secret'
```

### Agendar consulta

```bash
curl -X POST http://localhost:8787/api/v1/consultas/agendar \
  -H 'content-type: application/json' \
  -H 'x-api-user: hospital_user' \
  -H 'x-api-secret: hospital_secret' \
  -d '{"especialidadeId":"esp-cardio","medicoId":"med-001","unidade":"Hospital Central","data":"2026-05-15","horario":"09:30","convenio":"pln-saude-plus"}'
```

### Status de atendimento omnichannel

```bash
curl http://localhost:8787/api/v1/atendimentos/ATD-123/status \
  -H 'x-api-user: services_user' \
  -H 'x-api-secret: services_secret'
```

### Enviar notificação WhatsApp

```bash
curl -X POST http://localhost:8787/api/v1/notificacoes \
  -H 'content-type: application/json' \
  -H 'x-api-user: services_user' \
  -H 'x-api-secret: services_secret' \
  -d '{"canal":"whatsapp","destino":"+5511999990001","mensagem":"Seu protocolo foi atualizado."}'
```


## Como baixar documentação e collections online

Use `/docs` para abrir a interface Swagger no navegador. Esse endpoint retorna HTML, então no Postman ele aparece como código HTML. Para baixar os arquivos de documentação/integração, use os endpoints diretos:

| Arquivo | URL | Uso |
|---|---|---|
| OpenAPI YAML | `/openapi/openapi.yaml` | Importar no Swagger, Stoplight, Insomnia, Postman ou baixar a especificação |
| Postman Collection | `/postman/collection.json` | Importar coleção no Postman |
| Postman Environment | `/postman/environment.json` | Importar variáveis de ambiente no Postman |
| Índice de downloads | `/docs/downloads` | Retorna JSON com todos os links disponíveis |

Exemplos online:

```bash
curl -L https://SUA_URL/openapi/openapi.yaml -o openapi.yaml
curl -L https://SUA_URL/postman/collection.json -o mock-api-platform.postman_collection.json
curl -L https://SUA_URL/postman/environment.json -o mock-api-platform.postman_environment.json
```

No Postman, para visualizar a documentação interativa use o navegador em `https://SUA_URL/docs`; para importar a documentação, use `https://SUA_URL/openapi/openapi.yaml`.

## Postman

Arquivos disponíveis:

- `postman/collection.json`
- `postman/environment.json`

Regenerar:

```bash
npm run postman:generate
```

A collection contém exemplos de sucesso, erro, timeout e vazio.

## GitHub

O projeto está pronto para versionamento:

```bash
git init
git add .
git commit -m "Create mock API platform"
git remote add origin <repo>
git push -u origin main
```
