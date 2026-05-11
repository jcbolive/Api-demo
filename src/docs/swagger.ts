import type { Context } from 'hono';
import type { ApiEnv } from '../types/api';

export const swagger = (c: Context<ApiEnv>) => c.html(`<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Mock API Platform Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
    <style>
      body { margin: 0; }
      .download-bar { align-items: center; background: #0f172a; color: #fff; display: flex; flex-wrap: wrap; gap: 12px; padding: 12px 24px; }
      .download-bar strong { margin-right: 8px; }
      .download-bar a { background: #2563eb; border-radius: 6px; color: #fff; font-family: sans-serif; padding: 8px 12px; text-decoration: none; }
      .download-bar a.secondary { background: #475569; }
    </style>
  </head>
  <body>
    <div class="download-bar">
      <strong>Mock API Platform</strong>
      <a href="/openapi/openapi.yaml" download="openapi.yaml">Baixar OpenAPI YAML</a>
      <a href="/postman/collection.json" download="mock-api-platform.postman_collection.json">Baixar Postman Collection</a>
      <a href="/postman/environment.json" download="mock-api-platform.postman_environment.json" class="secondary">Baixar Postman Environment</a>
    </div>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.ui = SwaggerUIBundle({ url: '/openapi/openapi.yaml', dom_id: '#swagger-ui' });
    </script>
  </body>
</html>`);
