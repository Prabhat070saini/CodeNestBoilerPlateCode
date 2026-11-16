import { FastifyInstance } from 'fastify';
import helmet from '@fastify/helmet';
import { config } from '../../../config/config';
import { EApplicationEnvironmentType } from '../../constants';

export async function registerHelmet(fastify: FastifyInstance): Promise<void> {
  const HSTS_ENABLED_ENVIRONMENTS = [
    EApplicationEnvironmentType.PRODUCTION,
    EApplicationEnvironmentType.UAT,
  ];
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

    strictTransportSecurity: HSTS_ENABLED_ENVIRONMENTS.includes(config.env)
      ? {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: false,
        }
      : false,

    xContentTypeOptions: true,
    xFrameOptions: { action: 'deny' },
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin',
    },
  });
}
