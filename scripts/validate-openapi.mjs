import { readFileSync } from 'node:fs';

const yaml = readFileSync('openapi/openapi.yaml', 'utf8');
for (const key of ['openapi:', 'info:', 'paths:', 'components:']) {
  if (!yaml.includes(key)) throw new Error(`openapi/openapi.yaml sem campo obrigatório: ${key}`);
}
const expected = ['/health:', '/version:', '/auth/token:', '/clientes/cpf/{cpf}:', '/contratos/{contratoId}:', '/veiculos/placa/{placa}:', '/especialidades:', '/agendamentos:', '/notificacoes:'];
for (const path of expected) {
  if (!yaml.includes(`  ${path}`)) throw new Error(`Endpoint não documentado: ${path}`);
}
console.log(`OpenAPI válido com ${(yaml.match(/^  \/.+:$/gm) ?? []).length} paths.`);
