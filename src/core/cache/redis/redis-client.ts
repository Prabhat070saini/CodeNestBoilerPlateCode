/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';

import { Redis } from 'ioredis';
import { config } from '../../../config/config';

@Injectable()
export class RedisClient implements OnModuleInit, OnApplicationShutdown {
  private readonly logger = new Logger(RedisClient.name);
  private readonly client: Redis | undefined;
  private connected = false;

  constructor() {
    if (!config.redis.use_redis) {
      this.logger.warn('Redis is disabled via environment configuration.');
      return;
    }

    this.client = new Redis({
      host: config.redis.host,
      port: Number(config.redis.port),
      password: config.redis.password || undefined,

      // Don't connect automatically; connect during module initialization.
      lazyConnect: true,

      retryStrategy: (times: number): number | null => {
        if (times > config.redis.retry_limit) {
          this.logger.error(
            `Redis retry limit (${config.redis.retry_limit}) exceeded.`,
          );

          return null;
        }

        const delay = Math.min(times * 200, 2000);

        this.logger.warn(
          `Redis reconnecting in ${delay}ms (attempt ${times}/${config.redis.retry_limit})`,
        );

        return delay;
      },
    });

    this.client.on('connect', () => {
      this.connected = true;
    });

    this.client.on('ready', () => {
      this.logger.log('Redis client ready');
    });

    this.client.on('error', (err: Error) => {
      this.connected = false;
      this.logger.error(`Redis error: ${err.message}`, err.stack);
    });

    this.client.on('close', () => {
      this.connected = false;
      this.logger.warn('Redis connection closed');
    });
  }

  async onModuleInit(): Promise<void> {
    if (!config.redis.use_redis) {
      return;
    }

    if (!this.client) {
      throw new Error('Redis client is not initialized');
    }

    try {
      this.logger.log('Connecting to Redis...');

      await this.client.connect();

      if (this.client.status !== 'ready') {
        throw new Error(`Redis is not ready. Status: ${this.client.status}`);
      }

      this.connected = true;
      this.logger.log('Redis connection established successfully');
    } catch (error) {
      this.connected = false;

      this.logger.error(
        `Redis connection failed. Application startup aborted: ${(error as Error).message}`,
      );

      // Prevent further reconnection attempts.
      this.client.disconnect();

      throw new Error(`Redis connection failed: ${(error as Error).message}`);
    }
  }
  getClient(): Redis {
    if (!this.client) {
      throw new Error('Redis is disabled or not initialized');
    }

    return this.client;
  }

  isConnected(): boolean {
    return this.connected;
  }

  async onApplicationShutdown(signal?: string): Promise<void> {
    this.logger.log(`Redis shutting down: ${signal ?? 'manual stop'}`);

    if (this.client && this.client.status !== 'end') {
      await this.client.quit();
    }
  }
}
