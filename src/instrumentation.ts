import { context, propagation, trace } from '@opentelemetry/api';

import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';

import {
  CompositePropagator,
  W3CBaggagePropagator,
  W3CTraceContextPropagator,
} from '@opentelemetry/core';

import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';

import { createOtelTracerProvider } from './common/lib/logger/tracer.provider';

// Initialize tracing
const tracerProvider = createOtelTracerProvider();

trace.setGlobalTracerProvider(tracerProvider);

context.setGlobalContextManager(new AsyncLocalStorageContextManager().enable());

propagation.setGlobalPropagator(
  new CompositePropagator({
    propagators: [new W3CTraceContextPropagator(), new W3CBaggagePropagator()],
  }),
);

// Register HTTP instrumentation
registerInstrumentations({
  instrumentations: [new HttpInstrumentation()],
});

// Start NestJS
import('./main');
