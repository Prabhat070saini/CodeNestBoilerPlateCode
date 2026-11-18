import {
  LoggerProvider,
  SimpleLogRecordProcessor,
  ConsoleLogRecordExporter,
} from '@opentelemetry/sdk-logs';

import { resourceFromAttributes } from '@opentelemetry/resources';
import { config } from '../../../config/config';

export const OTEL_LOGGER_PROVIDER = Symbol('OTEL_LOGGER_PROVIDER');

export const createOtelLoggerProvider = (): LoggerProvider => {
  /*eslint-disable */
  return new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'Japyee-API',
      'service.version': '1.0.0',
      'deployment.environment.name': config.env,
    }),
    /*eslint-enable */
    processors: [
      new SimpleLogRecordProcessor({
        exporter: new ConsoleLogRecordExporter(),
      }),
    ],
  });
};
