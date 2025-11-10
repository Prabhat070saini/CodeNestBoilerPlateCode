import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { RedisClient } from './redis-client';
import { CacheBase } from '../cache.interface';
import { config } from '../../../config/config';

@Injectable()
export class RedisCacheService implements CacheBase, OnApplicationShutdown {
  private readonly logger = new Logger(RedisCacheService.name);
  private client;
  private readonly enabled = config.redis.use_redis;

  constructor(private readonly redisClient: RedisClient) {
    if (this.enabled) {
      this.client = redisClient.getClient();
      this.logger.log('🧠 Redis cache is ENABLED');
    } else {
      this.logger.warn('🚫 Redis cache is DISABLED via environment config');
    }
  }
  private parseExpiryToSeconds(exp: number | string): number {
    if (typeof exp === 'number') return exp; // already in seconds

    const match = /^(\d+)([smhd])$/.exec(exp.trim());
    if (!match) throw new Error(`Invalid expiry format: "${exp}"`);

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 60 * 60 * 24;
      default:
        throw new Error(`Unknown expiry unit: "${unit}"`);
    }
  }

  async onApplicationShutdown(signal?: string) {
    this.logger.log(
      `🧹 [RedisCacheService] Closing Redis due to signal: ${signal ?? 'manual stop'}`,
    );
    // await this.redisClient.closeConnection();
  }

  // Get key
  async getKey(key: string): Promise<string | object | undefined> {
    try {
      if (!this.enabled) return undefined;
      const data = await this.client.get(key);
      if (!data) return undefined;
      try {
        return JSON.parse(data);
      } catch {
        return data;
      }
    } catch (error) {
      throw Error(
        `[RedisCacheService:getKey] Error retrieving key "${key}": ${error}`,
      );
    }
  }

  // Set key
  async setKey(key: string, value: string | object): Promise<void> {
    try {
      if (!this.enabled) return;
      const data =
        typeof value === 'object' && value !== null
          ? JSON.stringify(value)
          : value;
      await this.client.set(key, data);
      this.logger.log(`✅ Cache saved for key: ${key}`);
    } catch (error) {
      throw Error(
        `[RedisCacheService:setKey] Error saving key "${key}": ${error}`,
      );
    }
  }

  //  Set key with expiry
  async setKeyWithExpiry(
    key: string,
    value: string | object,
    exp: number | string,
  ): Promise<void> {
    try {
      if (!this.enabled) return;

      const expInSec = this.parseExpiryToSeconds(exp);
      const data =
        typeof value === 'object' && value !== null
          ? JSON.stringify(value)
          : value;

      await this.client.set(key, data, 'EX', expInSec);
      this.logger.log(
        `✅ Cache saved with expiry (${expInSec}s) for key: ${key}`,
      );
    } catch (error) {
      throw Error(
        `[RedisCacheService:setKeyWithExpiry] Error saving key "${key}": ${error}`,
      );
    }
  }

  //  Delete key
  async deleteKey(key: string): Promise<void> {
    try {
      if (!this.enabled) return;
      const result = await this.client.del(key);
      if (result === 1)
        this.logger.log(`[deleteKey] Key "${key}" deleted from cache`);
      else
        this.logger.warn(
          `[deleteKey] Key "${key}" not found or already deleted`,
        );
    } catch (error) {
      throw Error(
        `[RedisCacheService:deleteKey] Error deleting key "${key}": ${error}`,
      );
    }
  }
}
