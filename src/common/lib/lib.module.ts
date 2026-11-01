import { Global, Module } from '@nestjs/common';

import { TracingService } from './tracing/tracing.service';
import { CustomLoggerService } from './logger/custom.logger';
import { config } from '../../config/config';
import { LogLevel } from '../constants';
import { FastifyTracingProvider } from './http/fastify';

const validLevels: LogLevel[] = ['error', 'warn', 'info', 'debug'];

const configuredLevel = config.log_level || 'debug';

const logLevel: LogLevel = validLevels.includes(configuredLevel as LogLevel)
  ? (configuredLevel as LogLevel)
  : 'info';

@Global()
@Module({
  providers: [
    TracingService,
    FastifyTracingProvider,
    {
      provide: CustomLoggerService,
      useFactory: (tracingService: TracingService): CustomLoggerService =>
        new CustomLoggerService(tracingService, logLevel),
      inject: [TracingService],
    },
  ],
  exports: [TracingService, CustomLoggerService],
})
export class LibModule {}
