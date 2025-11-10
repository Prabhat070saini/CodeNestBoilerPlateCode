import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { CacheModule } from './cache/cache.module';
@Module({
  imports: [DatabaseModule, CacheModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class SharedModule {}
