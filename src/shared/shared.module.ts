import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { CacheModule } from './cache/cache.module';
import { QueueModule } from './queue/queue.module';
import { QueueProviderType } from './queue/queue.constants';

const queueModule = QueueModule.forRoot(QueueProviderType.RABBITMQ, {
  url: 'amqp://localhost',
  defaultRetries: 3,
  defaultRetryDelayMs: 5000,
  isDlq: true,
});
@Module({
  imports: [DatabaseModule, CacheModule, queueModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class SharedModule {}
