import { FastifyInstance } from 'fastify';

export function registerContentTypeParsers(fastify: FastifyInstance): void {
  fastify.addContentTypeParser(
    'text/plain',
    { parseAs: 'string' },
    (_request, body, done) => {
      done(null, body);
    },
  );
}
