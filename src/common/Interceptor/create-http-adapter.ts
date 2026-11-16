import { FastifyAdapter } from '@nestjs/platform-fastify';

import { registerFastifyDecorators } from '../decorators/request.decorator';
import { registerInterceptor } from './register.interceptor';
import { registerContentTypeParsers } from './parsers/text-plain.parser';

export async function createFastifyAdapter(): Promise<FastifyAdapter> {
  const adapter = new FastifyAdapter({
    bodyLimit: 100 * 1024 * 1024,
  });

  const fastify = adapter.getInstance();

  registerFastifyDecorators(fastify);
  registerContentTypeParsers(fastify);
  await registerInterceptor(fastify);

  return adapter;
}
