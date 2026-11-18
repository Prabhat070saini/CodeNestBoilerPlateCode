import { TracerProvider } from '@opentelemetry/sdk-trace';

import { resourceFromAttributes } from '@opentelemetry/resources';
import { config } from '../../../config/config';

export const OTEL_TRACER_PROVIDER = Symbol('OTEL_TRACER_PROVIDER');

export const createOtelTracerProvider = (): TracerProvider => {
  return new TracerProvider({
    /*eslint-disable */
    resource: resourceFromAttributes({
      'service.name': 'Japyee-API',
      'service.version': '1.0.0',
      'deployment.environment.name': config.env,
    }),
    /*eslint-enable */
  });
};
