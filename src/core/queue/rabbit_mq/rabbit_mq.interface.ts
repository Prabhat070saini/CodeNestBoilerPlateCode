/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IRabbitMQConsumeOptions {
  retries?: number;
  retryDelayMs?: number;
  dlq?: string;
  queueOptions?: any;
}

export interface IRabbitMQPublishOptions {
  persistent?: boolean;
  headers?: Record<string, any>;
  [key: string]: any;
}
export interface IRabbitMQConfig {
  url: string;
  defaultRetries?: number;
  defaultRetryDelayMs?: number;

  globalQueueOptions?: any;
  isDlq?: boolean;
}
/* eslint-enable @typescript-eslint/no-explicit-any */
