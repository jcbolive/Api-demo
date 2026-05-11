declare module 'hono' {
  export type Next = () => Promise<void>;
  export type MiddlewareHandler<E = unknown> = (c: Context<E>, next: Next) => Response | Promise<Response | void> | void;
  export type Handler<E = unknown> = (c: Context<E>) => Response | Promise<Response>;
  export class Hono<E = unknown> {
    use(path: string, handler: MiddlewareHandler<E>): this;
    use(path: string, ...handlers: MiddlewareHandler<E>[]): this;
    get(path: string, handler: Handler<E>): this;
    post(path: string, handler: Handler<E>): this;
    delete(path: string, handler: Handler<E>): this;
    route(path: string, app: Hono<E>): this;
    notFound(handler: Handler<E>): this;
    onError(handler: (err: Error, c: Context<E>) => Response | Promise<Response>): this;
  }
  export class Context<E = unknown> {
    req: {
      method: string;
      url: string;
      header(name: string): string | undefined;
      query(name: string): string | undefined;
      param(name: string): string;
      json(): Promise<any>;
    };
    res: Response;
    env: E extends { Bindings: infer B } ? B : Record<string, string | undefined>;
    json<T>(body: T, status?: number, headers?: Record<string, string>): Response;
    text(body: string, status?: number, headers?: Record<string, string>): Response;
    html(body: string, status?: number, headers?: Record<string, string>): Response;
    header(name: string, value: string): void;
    get<K extends keyof (E extends { Variables: infer V } ? V : Record<string, unknown>)>(key: K): (E extends { Variables: infer V } ? V : Record<string, unknown>)[K];
    set<K extends keyof (E extends { Variables: infer V } ? V : Record<string, unknown>)>(key: K, value: (E extends { Variables: infer V } ? V : Record<string, unknown>)[K]): void;
  }
}

declare module 'hono/cors' {
  import type { MiddlewareHandler } from 'hono';
  export function cors(options: { origin: string; allowHeaders: string[]; allowMethods: string[] }): MiddlewareHandler;
}

