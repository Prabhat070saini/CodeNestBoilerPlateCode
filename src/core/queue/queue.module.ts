import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { QUEUE_PROVIDER, EQueueProviderType } from './queue.constants';
import { IQueueProvider, IQueueProviderConfig } from './queue.interface';

@Global()
@Module({})
export class QueueModule {
  static forRoot<T extends IQueueProviderConfig>(
    provider: EQueueProviderType,
    config: T,
  ): DynamicModule {
    const queueProvider: Provider<IQueueProvider> = {
      provide: QUEUE_PROVIDER,
      useFactory: async (): Promise<IQueueProvider> => {
        if (provider === EQueueProviderType.RABBITMQ) {
          const { RabbitMQService } = await import(
            './rabbit_mq/rabbit_mq.service.js'
          );
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          const instance = new RabbitMQService(config as any);

          await instance.connect();
          return instance;
        }

        throw new Error(`Unsupported queue provider: ${provider}`);
      },
    };

    return {
      module: QueueModule,
      global: true,
      providers: [queueProvider],
      exports: [queueProvider],
    };
  }
}
