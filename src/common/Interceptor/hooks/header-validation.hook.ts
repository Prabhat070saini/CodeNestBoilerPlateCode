import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ALLOWED_HEADERS, exception } from '../../constants';
import { HttpStatus, Logger } from '@nestjs/common';
import { config } from '../../../config/config';

export function registerHeaderValidation(fastify: FastifyInstance): void {
  const logger = new Logger('HeaderValidation', { timestamp: true });
  fastify.addHook(
    'onRequest',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const origin = request.headers['origin'] || request.headers['referer'];
      const invalidHeaders = Object.keys(request.headers).filter(
        (header) => !ALLOWED_HEADERS.has(header.toLowerCase()),
      );
      if (!config.app.api_tool_enabled && invalidHeaders.length > 0) {
        if (origin && !config.cors.origins.includes(origin)) {
          logger.warn(`Invalid origin found: ${origin}`);
          return reply
            .code(HttpStatus.UNAUTHORIZED)
            .send(exception.INVALID_ORIGIN);
        }
        logger.warn(`Invalid headers found: ${invalidHeaders.join(', ')}`);
        return reply
          .code(HttpStatus.UNAUTHORIZED)
          .send(exception.INVALID_HEADER);
      }
    },
  );
}
