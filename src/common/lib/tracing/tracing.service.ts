import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';

export interface TracingContext {
  tracingId: string;
  startTime: [number, number];
}

@Injectable()
export class TracingService {
  private readonly asyncLocalStorage = new AsyncLocalStorage<TracingContext>();

  run<T>(context: TracingContext, callback: () => T): T {
    return this.asyncLocalStorage.run(context, callback);
  }

  getTracingId(): string | undefined {
    return this.asyncLocalStorage.getStore()?.tracingId;
  }

  getStartTime(): [number, number] | undefined {
    return this.asyncLocalStorage.getStore()?.startTime;
  }
}
