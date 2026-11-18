import { Injectable, LoggerService, Inject } from '@nestjs/common';

import { context as otelContext } from '@opentelemetry/api';

import { Logger, SeverityNumber } from '@opentelemetry/api-logs';

import { LoggerProvider } from '@opentelemetry/sdk-logs';

import { TracingService } from '../tracing/tracing.service';

import { LOGGER_LEVEL, LogLevel } from '../../constants';

import { OTEL_LOGGER_PROVIDER } from './logger.provider';

type LogAttributes = Record<string, string | number | boolean>;

@Injectable()
export class CustomLoggerService implements LoggerService {
  private readonly logger: Logger;

  private readonly levels: Record<LogLevel, number> = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  };

  private readonly severity: Record<LogLevel, SeverityNumber> = {
    error: SeverityNumber.ERROR,
    warn: SeverityNumber.WARN,
    info: SeverityNumber.INFO,
    debug: SeverityNumber.DEBUG,
  };

  constructor(
    private readonly tracingService: TracingService,

    @Inject(OTEL_LOGGER_PROVIDER)
    private readonly loggerProvider: LoggerProvider,

    @Inject(LOGGER_LEVEL)
    private readonly level: LogLevel,
  ) {
    this.logger = this.loggerProvider.getLogger('application-logger');
  }

  log(message: string, context: string): void {
    this.write('info', message, context);
  }

  info(message: string, context: string): void {
    this.write('info', message, context);
  }

  warn(message: string, context: string): void {
    this.write('warn', message, context);
  }

  debug(message: string, context: string): void {
    this.write('debug', message, context);
  }

  error(
    message: string,
    context: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any,
  ): void {
    const stack =
      error instanceof Error
        ? error.stack
        : typeof error === 'string'
          ? error
          : undefined;

    this.write('error', message, context, {
      ...(stack && { stack }),
      ...(error instanceof Error && {
        errorName: error.name,
      }),
    });
  }

  private write(
    level: LogLevel,
    message: string,
    context?: string,
    extraAttributes: LogAttributes = {},
  ): void {
    if (this.levels[level] > this.levels[this.level]) {
      return;
    }

    const activeContext = otelContext.active();

    const tracingId = this.tracingService.getTracingId();

    const attributes: LogAttributes = {
      ...this.normalizeAttributes(message),
      ...extraAttributes,
      // Custom ULID correlation ID
      ...(tracingId && { tracingId }),
    };

    this.logger.emit({
      eventName: context || 'log',
      context: activeContext,
      severityNumber: this.severity[level],
      severityText: level.toUpperCase(),
      body: message,
      attributes,
    });
  }

  private normalizeAttributes(value: unknown): LogAttributes {
    if (
      !value ||
      typeof value !== 'object' ||
      value instanceof Error ||
      Array.isArray(value)
    ) {
      return {};
    }

    const attributes: LogAttributes = {};

    for (const [key, item] of Object.entries(value)) {
      if (
        typeof item === 'string' ||
        typeof item === 'number' ||
        typeof item === 'boolean'
      ) {
        attributes[key] = item;
      } else if (item !== undefined && item !== null) {
        attributes[key] = this.safeStringify(item);
      }
    }

    return attributes;
  }

  private safeStringify(value: unknown): string {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
}
