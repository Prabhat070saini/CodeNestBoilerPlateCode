import { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { config } from '../../../../config/config';

export async function registerFastifyPlugins(
  fastify: FastifyInstance,
): Promise<void> {
  // 1. CORS
  await fastify.register(cors, {
    origin: config.cors.origins.length ? config.cors.origins : false,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'tracing_id',
      'x-api-key',
    ],
  });

  // 2. Security headers
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

    // HSTS should be enabled when requests are served over HTTPS.
    hsts:
      process.env.NODE_ENV === 'production'
        ? {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
          }
        : false,

    // Additional browser security policies
    xContentTypeOptions: true,
    xFrameOptions: {
      action: 'deny',
    },
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin',
    },
  });

  // 3. Prevent caching of API responses
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
