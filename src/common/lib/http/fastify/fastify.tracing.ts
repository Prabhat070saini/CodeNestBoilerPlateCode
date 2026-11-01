import { FastifyInstance } from 'fastify';
import { Logger } from '@nestjs/common';

import { TracingService } from '../../tracing/tracing.service';
import { UtilsService } from '../../../utils/utils.service';

export function registerTracingHooks(
  fastify: FastifyInstance,
  tracingService: TracingService,
  utilsService: UtilsService,
): void {
  const logger = new Logger('TracingMiddleware');

  // Incoming request
  fastify.addHook('onRequest', (request, reply, done) => {
    // Get existing tracing ID or generate a new one
    const tracingId =
      (request.headers['x-request-id'] as string) ||
      utilsService.generateUlId();

    // Capture request start time
    const startTime = process.hrtime();

    // Create tracing context
    tracingService.run(
      {
        tracingId,
        startTime,
      },
      () => {
        // Attach tracing ID to request and response
        reply.header('x-request-id', tracingId);

        // Log incoming request
        const protocol = request.protocol;
        const host = request.headers.host || 'localhost';
        const fullUrl = `${protocol}://${host}${request.url}`;

        logger.log({
          log: 'Incoming request',
          method: request.method,
          url: fullUrl,
          headers: request.headers,
          tracingId,
        });

        done();
      },
    );
  });

  // Response completed
  fastify.addHook('onResponse', async (request, reply) => {
    const startTime = tracingService.getStartTime();

    if (!startTime) {
      return;
    }

    // Calculate response time
    const [seconds, nanoseconds] = process.hrtime(startTime);

    const responseTimeMs = (seconds * 1e3 + nanoseconds / 1e6).toFixed(2);

    const protocol = request.protocol;
    const host = request.headers.host || 'localhost';
    const fullUrl = `${protocol}://${host}${request.url}`;

    // Log response details
    logger.log({
      log: 'Api Response',
      status: reply.statusCode,
      method: request.method,
      url: fullUrl,
      response_time: `${responseTimeMs}ms`,
      tracingId: tracingService.getTracingId(),
    });
  });
}
