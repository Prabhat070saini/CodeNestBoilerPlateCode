import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  ALLOWED_HEADERS,
  EApplicationEnvironmentType,
  exception,
} from '../../../constants';
import { HttpStatus, Logger } from '@nestjs/common';
import { config } from '../../../../config/config';

export function registerHeaderValidation(fastify: FastifyInstance): void {
  const logger = new Logger('HeaderValidation', { timestamp: true });
  fastify.addHook(
    'onRequest',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const invalidHeaders = Object.keys(request.headers).filter(
        (header) => !ALLOWED_HEADERS.has(header.toLowerCase()),
      );

      if (
        config.env === EApplicationEnvironmentType.PRODUCTION &&
        invalidHeaders.length > 0
      ) {
        logger.warn(`Invalid headers found: ${invalidHeaders.join(', ')}`);
        return reply
          .code(HttpStatus.UNAUTHORIZED)
          .send(exception.INVALID_HEADER);
      }
    },
  );
}
