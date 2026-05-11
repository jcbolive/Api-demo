import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { ApiEnv } from './types/api';
import { authMiddleware } from './middleware/auth';
import { delayMiddleware } from './middleware/delay';
import { errorHandler, notFoundHandler } from './middleware/error';
import { loggerMiddleware } from './middleware/logger';
import { requestIdMiddleware } from './middleware/request-id';
import { applyScenario } from './utils/scenario';
import { swagger } from './docs/swagger';
import { openApiYaml } from './openapi/spec';
import { agendamentosRoutes } from './routes/agendamentos';
import { atendimentoRoutes } from './routes/atendimento';
import { authRoutes } from './routes/auth';
import { clientesRoutes } from './routes/clientes';
import { contratosRoutes } from './routes/contratos';
import { saudeRoutes } from './routes/saude';
import { systemRoutes } from './routes/system';
import { veiculosRoutes } from './routes/veiculos';

const app = new Hono<ApiEnv>();

app.use('*', cors({ origin: '*', allowHeaders: ['content-type', 'authorization', 'x-api-user', 'x-api-secret', 'x-request-id', 'x-mock-scenario', 'x-mock-delay-ms'], allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'] }));
app.use('*', requestIdMiddleware);
app.use('*', loggerMiddleware);
app.use('/api/v1/*', delayMiddleware);
app.use('/api/v1/*', authMiddleware);
app.use('/api/v1/*', applyScenario);

app.get('/docs', swagger);
app.get('/openapi/openapi.yaml', (c) => c.text(openApiYaml, 200, { 'content-type': 'application/yaml; charset=utf-8' }));

app.route('/api/v1', systemRoutes);
app.route('/api/v1/auth', authRoutes);
app.route('/api/v1/clientes', clientesRoutes);
app.route('/api/v1/contratos', contratosRoutes);
app.route('/api/v1/veiculos', veiculosRoutes);
app.route('/api/v1', saudeRoutes);
app.route('/api/v1/agendamentos', agendamentosRoutes);
app.route('/api/v1', atendimentoRoutes);

app.notFound(notFoundHandler);
app.onError(errorHandler);

export default app;
