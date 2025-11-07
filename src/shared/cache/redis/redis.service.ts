import { Injectable, Logger, OnApplicationShutdown } from "@nestjs/common";
import { RedisClient } from "./redis-client";
import { CacheBase } from "../cache.interface";

@Injectable()
export class RedisCacheService implements CacheBase, OnApplicationShutdown {
  private readonly logger = new Logger(RedisCacheService.name);
  private client;

  constructor(private readonly redisClient: RedisClient) {
    this.client = redisClient.getClient();
  }



  async onApplicationShutdown(signal?: string) {
    this.logger.log(`🧹 [RedisCacheService] Closing Redis due to signal: ${signal ?? "manual stop"}`);
    // await this.redisClient.closeConnection();
  }

  // 🔍 Get key
  async getKey(key: string): Promise<string | object | undefined> {
    try {
      const data = await this.client.get(key);
      if (!data) return undefined;
      try {
        return JSON.parse(data);
      } catch {
        return data;
      }
    } catch (error) {
      throw Error(`[RedisCacheService:getKey] Error retrieving key "${key}": ${error}`);
    }
  }

  // 💾 Set key
  async setKey(key: string, value: string | object): Promise<void> {
    try {
      const data =
        typeof value === "object" && value !== null ? JSON.stringify(value) : value;
      await this.client.set(key, data);
      this.logger.log(`✅ Cache saved for key: ${key}`);
    } catch (error) {
      throw Error(`[RedisCacheService:setKey] Error saving key "${key}": ${error}`);
    }
  }

  // ⏰ Set key with expiry
  async setKeyWithExpiry(key: string, value: string | object, expInSec: number): Promise<void> {
    try {
      const data =
        typeof value === "object" && value !== null ? JSON.stringify(value) : value;
      await this.client.set(key, data, "EX", expInSec);
      this.logger.log(`✅ Cache saved with expiry for key: ${key}`);
    } catch (error) {
      throw Error(`[RedisCacheService:setKeyWithExpiry] Error saving key "${key}": ${error}`);
    }
  }

  // ❌ Delete key
  async deleteKey(key: string): Promise<void> {
    try {
      const result = await this.client.del(key);
      if (result === 1)
        this.logger.log(`[deleteKey] Key "${key}" deleted from cache`);
      else this.logger.warn(`[deleteKey] Key "${key}" not found or already deleted`);
    } catch (error) {
      throw Error(`[RedisCacheService:deleteKey] Error deleting key "${key}": ${error}`);
    }
  }
}
