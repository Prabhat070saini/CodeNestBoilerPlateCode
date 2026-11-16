import { FastifyInstance } from 'fastify';
import { registerCors, registerHelmet } from './plugins';
import { registerHeaderValidation, registerCacheControl } from './hooks';

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
