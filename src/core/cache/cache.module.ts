import { DynamicModule, Global, Module } from '@nestjs/common';

import { RedisModule } from './redis/redis.module';
import { RedisCacheService } from './redis/redis.service';

import { CACHE_PROVIDER, CacheProviderType } from './cache.constants';

@Global()
@Module({})
export class CacheModule {
  static forRoot(provider: CacheProviderType): DynamicModule {
    let cacheProvider;

    switch (provider) {
      case CacheProviderType.REDIS:
        cacheProvider = {
          provide: CACHE_PROVIDER,
          useExisting: RedisCacheService,
        };
        break;

      default:
        throw new Error(`Unsupported cache provider: ${provider}`);
    }

    return {
      module: CacheModule,
      global: true,
      imports: [RedisModule],
      providers: [cacheProvider],
      exports: [CACHE_PROVIDER],
    };
  }
}
