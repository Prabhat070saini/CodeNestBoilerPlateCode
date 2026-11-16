import { FastifyInstance } from 'fastify';

export function registerCacheControl(fastify: FastifyInstance): void {
  fastify.addHook('onSend', async (_request, reply, payload) => {
    reply.header(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate',
    );
    reply.header('Pragma', 'no-cache');
    reply.header('Expires', '0');

    return payload;
  });
}
