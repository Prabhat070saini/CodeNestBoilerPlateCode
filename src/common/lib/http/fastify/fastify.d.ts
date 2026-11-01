import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      ref: string;
      type: string;
      roles: string[];
    } | null;
  }
}
