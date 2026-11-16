import { FastifyAdapter } from '@nestjs/platform-fastify';

import { registerFastifyDecorators } from './decorator';
import { registerInterceptor } from './register.interceptor';
import { FastifyInstance } from 'fastify';

export async function createFastifyAdapter(): Promise<FastifyAdapter> {
  const adapter = new FastifyAdapter({
    bodyLimit: 100 * 1024 * 1024,
  });

  const fastify = adapter.getInstance();

  registerFastifyDecorators(fastify);
  registerFastifyParsers(fastify);
  await registerInterceptor(fastify);

  return adapter;
}

export function registerFastifyParsers(fastify: FastifyInstance): void {
  fastify.addContentTypeParser(
    'text/plain',
    { parseAs: 'string' },
    (_request, body, done) => {
      done(null, body);
    },
  );
}
