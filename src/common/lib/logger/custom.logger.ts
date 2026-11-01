import { Injectable, LoggerService, Inject } from '@nestjs/common';
import * as winston from 'winston';

import { TracingService } from '../tracing/tracing.service';
import {
  EApplicationEnvironmentType,
  LOGGER_LEVEL,
  LogLevel,
} from '../../constants';
import { config } from '../../../config/config';

@Injectable()
export class CustomLoggerService implements LoggerService {
  private readonly logger: winston.Logger;

  constructor(
    private readonly tracingService: TracingService,
    @Inject(LOGGER_LEVEL)
    private readonly level: LogLevel,
  ) {
    winston.addColors({
      error: 'red',
      warn: 'yellow',
      info: 'green',
      debug: 'magenta',
    });

    const isDevelopment = config.env !== EApplicationEnvironmentType.PRODUCTION;
    this.logger = winston.createLogger({
      levels: {
        error: 0,
        warn: 1,
        info: 2,
        debug: 3,
      },

      level: this.level,

      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.errors({ stack: true }),
      ),

      transports: [
        new winston.transports.Console({
          format: isDevelopment
            ? winston.format.combine(
                winston.format.colorize({ level: true }),
                winston.format.printf(
                  ({ timestamp, level, message, ...metadata }) => {
                    const meta = Object.keys(metadata).length
                      ? ` ${JSON.stringify(metadata)}`
                      : '';

                    return `[${timestamp}] [${level}] ${message}${meta}`;
                  },
                ),
              )
            : winston.format.json(),
        }),
      ],
    });
  }

  log(message: any, context?: string): void {
    this.write('info', message, context);
  }

  info(message: any, context?: string): void {
    this.write('info', message, context);
  }

  warn(message: any, context?: string): void {
    this.write('warn', message, context);
  }

  debug(message: any, context?: string): void {
    this.write('debug', message, context);
  }

  error(message: any, trace?: string, context?: string): void {
    this.write('error', message, context, trace);
  }

  private write(
    level: LogLevel,
    message: any,
    context?: string,
    trace?: string,
  ): void {
    const tracingId = this.tracingService.getTracingId();

    const logMessage =
      message instanceof Error
        ? message.message
        : typeof message === 'string'
          ? message
          : this.safeStringify(message);

    this.logger.log({
      level,
      message: logMessage,
      context,
      tracingId,
      ...(trace && { trace }),
      ...(message instanceof Error && {
        stack: message.stack,
      }),
    });
  }

  private safeStringify(value: unknown): string {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
}
