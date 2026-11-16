import { FastifyInstance } from 'fastify';
import { registerCors } from './plugins/cors.plugin';
import { registerHelmet } from './plugins/helmet.plugin';
import { registerCacheControl } from './hooks/cache-control.hook';
import { registerHeaderValidation } from './hooks/header-validation.hook';

export async function registerInterceptor(
  fastify: FastifyInstance,
): Promise<void> {
  // 1. CORS
  await registerCors(fastify);

  // 2. Security headers
  await registerHelmet(fastify);

  // 3. Prevent caching of API responses
  registerCacheControl(fastify);

  // 4. Header validation
  registerHeaderValidation(fastify);
}
