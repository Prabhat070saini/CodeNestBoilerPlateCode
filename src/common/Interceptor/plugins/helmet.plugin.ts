import { FastifyInstance } from 'fastify';
import helmet from '@fastify/helmet';

export async function registerHelmet(fastify: FastifyInstance): Promise<void> {
  await fastify.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },

    hsts:
      process.env.NODE_ENV === 'production'
        ? {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
          }
        : false,

    xContentTypeOptions: true,
    xFrameOptions: { action: 'deny' },
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin',
    },
  });
}
