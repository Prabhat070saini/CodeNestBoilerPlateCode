import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { tracingNamespace, TracingService } from './tracing.service';

@Injectable()
export class TracingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TracingMiddleware.name);
  constructor(private readonly tracingService: TracingService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    // Ensure tracingId is always treated as a string
    const tracingId = (req.headers['tracing_id'] || uuidv4()) as string;

    tracingNamespace.run(() => {
      // Set the tracing ID in the tracing service
      this.tracingService.setTracingId(tracingId);
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const fullUrl = `${baseUrl}${req.originalUrl}`;
      // Capture request start time
      const startTime = process.hrtime();
      this.logger.log({
        log: 'Incoming request',
        method: req.method,
        url: fullUrl,
        headers: req.headers,
      });

      // Attach tracing ID to the request and response headers
      req.headers['tracing_id'] = tracingId;
      res.setHeader('tracing_id', tracingId);

      // Log the response details after the request is finished
      res.on('finish', () => {
        // Calculate response time in milliseconds
        const [seconds, nanoseconds] = process.hrtime(startTime);
        const responseTimeMs = (seconds * 1e3 + nanoseconds / 1e6).toFixed(2);
        this.logger.log({
          log: 'Api Response',
          status: res.statusCode,
          method: req.method,
          url: fullUrl,
          response_time: `${responseTimeMs}ms`,
        });
      });
      next();
    });
  }
}
