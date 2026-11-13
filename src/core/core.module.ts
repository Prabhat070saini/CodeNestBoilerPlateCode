import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ECacheProviderType } from './cache/cache.constants';
import { CacheModule } from './cache/cache.module';
// import { CacheModule } from './cache/cache.module';
// import { QueueModule } from './queue/queue.module';
// import { EQueueProviderType } from './queue/queue.constants';
// import { config } from '../config/config';

// // const queueModule = QueueModule.forRoot(EQueueProviderType.RABBITMQ, {
// //   url: config.queue.url,
// //   defaultRetries: config.queue.defaultRetries,
// //   defaultRetryDelayMs: config.queue.defaultRetryDelayMs,
// //   isDlq: config.queue.isDlq,
// // });
// ,

@Module({
  imports: [DatabaseModule, CacheModule.forRoot(ECacheProviderType.REDIS)],
  controllers: [],
  providers: [],
  exports: [],
})
export class CoreModule {}
