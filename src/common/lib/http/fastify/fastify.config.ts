import { FastifyAdapter } from '@nestjs/platform-fastify';

import { registerFastifyDecorators } from './fastify.decorator';
import { registerFastifyPlugins } from './fastify.plugins';
import { FastifyInstance } from 'fastify';
import { registerHeaderValidation } from './fastify.header-validation';

export async function createFastifyAdapter(): Promise<FastifyAdapter> {
  const adapter = new FastifyAdapter({
    bodyLimit: 100 * 1024 * 1024,
  });

  const fastify = adapter.getInstance();

  registerFastifyDecorators(fastify);
  registerFastifyParsers(fastify);
  registerHeaderValidation(fastify);
  await registerFastifyPlugins(fastify);

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
