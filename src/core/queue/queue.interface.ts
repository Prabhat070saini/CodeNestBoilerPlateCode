/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IQueueProvider {
  connect(): Promise<void>;
  publish(
    queueOrTopic: string,
    message: any,
    options?: Record<string, any>,
  ): Promise<void>;

  consume(
    queueOrTopic: string,
    handler: (message: any) => Promise<void>,
    options?: Record<string, any>,
    useDlq?: boolean,
  ): Promise<void>;

  disconnect(): Promise<void>;
}

export interface IQueueProviderConfig {
  [key: string]: any;
}

export interface IRabbitMQConfig extends IQueueProviderConfig {
  url: string;
  defaultRetries?: number;
  defaultRetryDelayMs?: number;
  defaultDLQSuffix?: string;
  globalQueueOptions?: any;
  isDlq?: boolean;
}
/* eslint-enable @typescript-eslint/no-explicit-any */
export interface IKafkaConfig extends IQueueProviderConfig {
  brokers: string[];
  clientId: string;
  groupId: string;
}
