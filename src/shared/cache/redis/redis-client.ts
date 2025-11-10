import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { Redis } from 'ioredis';
import { config } from 'src/config/config';

@Injectable()
export class RedisClient implements OnApplicationShutdown {
  private readonly logger = new Logger(RedisClient.name);
  private client: Redis;
  private connected = false;

  constructor() {
    if (!config.redis.use_redis) {
      this.logger.warn(
        '🚫 RedisClient not initialized because caching is disabled.',
      );
      return;
    }

    this.client = new Redis({
      host: config.redis.host,
      port: Number(config.redis.port),
      password: config.redis.password || undefined,
      retryStrategy: (times) => {
        const delay = Math.min(times * 200, 2000);
        this.logger.warn(
          `🔁 Redis reconnecting in ${delay}ms (attempt ${times})`,
        );
        return delay;
      },
    });

    // ✅ Listen for connection events
    this.client.on('connect', () => {
      this.connected = true;
      this.logger.log('✅ Redis connected successfully');
    });

    this.client.on('ready', () => {
      this.logger.log('🚀 Redis client ready to use');
    });

    this.client.on('error', (err) => {
      this.connected = false;
      this.logger.error(`❌ Redis Client Error: ${err.message}`, err.stack);
    });

    this.client.on('close', () => {
      this.connected = false;
      this.logger.warn('⚠️ Redis connection closed');
    });
  }

  getClient(): Redis {
    return this.client;
  }

  isConnected(): boolean {
    return this.connected;
  }

  // async closeConnection(): Promise<void> {
  //   try {
  //     if (!this.client) {
  //       this.logger.warn("⚠️ Redis client not initialized.");
  //       return;
  //     }

  //     if (this.client.status === "end" || !this.connected) {
  //       this.logger.warn("ℹ️ Redis connection already closed or ending.");
  //       return;
  //     }

  //     await this.client.quit();
  //     this.connected = false;
  //     this.logger.log("✅ Redis connection closed gracefully");
  //   } catch (error) {
  //     // Ignore harmless “Connection is closed” errors
  //     if (error?.message?.includes("Connection is closed")) {
  //       return;
  //     }

  //     this.logger.error(`❌ Error closing Redis connection: ${error.message}`, error.stack);
  //   }
  // }

  // 🔻 Automatically close on app shutdown
  async onApplicationShutdown(signal?: string): Promise<void> {
    this.logger.log(
      `🧹 [RedisClient] Shutting down due to signal: ${signal ?? 'manual stop'}`,
    );
    // await this.closeConnection();
  }
}
