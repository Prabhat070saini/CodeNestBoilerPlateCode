import { FastifyInstance } from 'fastify';

export function registerFastifyDecorators(fastify: FastifyInstance): void {
  registerRequestDecorators(fastify);
}

function registerRequestDecorators(fastify: FastifyInstance): void {
  fastify.decorateRequest('user', null);

  // Future request decorators
  // fastify.decorateRequest('tracingId', null);
  // fastify.decorateRequest('tenant', null);
  // fastify.decorateRequest('permissions', null);
}
