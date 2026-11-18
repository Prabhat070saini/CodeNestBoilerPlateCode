import { Global, Module } from '@nestjs/common';
import { LoggerProvider } from '@opentelemetry/sdk-logs';

import { TracingService } from './tracing/tracing.service';
import { CustomLoggerService } from './logger/custom.logger';
import {
  createOtelLoggerProvider,
  OTEL_LOGGER_PROVIDER,
} from './logger/logger.provider';

import { config } from '../../config/config';
import { LogLevel, LOGGER_LEVEL } from '../constants';
import { TracingProvider } from '../Interceptor';

const validLevels: LogLevel[] = ['error', 'warn', 'info', 'debug'];

const configuredLevel = config.log_level || 'debug';

const logLevel: LogLevel = validLevels.includes(configuredLevel as LogLevel)
  ? (configuredLevel as LogLevel)
  : 'info';

@Global()
@Module({
  providers: [
    TracingService,
    TracingProvider,

    {
      provide: LOGGER_LEVEL,
      useValue: logLevel,
    },

    {
      provide: OTEL_LOGGER_PROVIDER,
      useFactory: createOtelLoggerProvider,
    },

    {
      provide: CustomLoggerService,
      useFactory: (
        tracingService: TracingService,
        loggerProvider: LoggerProvider,
        level: LogLevel,
      ): CustomLoggerService =>
        new CustomLoggerService(tracingService, loggerProvider, level),
      inject: [TracingService, OTEL_LOGGER_PROVIDER, LOGGER_LEVEL],
    },
  ],
  exports: [
    TracingService,
    CustomLoggerService,
    OTEL_LOGGER_PROVIDER,
    LOGGER_LEVEL,
  ],
})
export class LibModule {}
