/* eslint-disable  */

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

      lazyConnect: true,

      retryStrategy: (times: number): number | null => {
        console.log('[Redis Retry Strategy] Attempt:', times);

        if (times >= Number(config.redis.retry_limit)) {
          console.error(
            `Redis retry limit (${config.redis.retry_limit}) exceeded.`,
          );

          return null;
        }

        const delay = Math.min(times * 200, 2000);

        console.warn(
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

    this.logger.log('Connecting to Redis...');

    await new Promise<void>((resolve, reject) => {
      const client = this.client!;

      const cleanup = () => {
        client.removeListener('ready', onReady);
        client.removeListener('end', onEnd);
      };

      const onReady = () => {
        cleanup();
        this.connected = true;

        this.logger.log('Redis connection established successfully');
        resolve();
      };

      const onEnd = () => {
        cleanup();
        this.connected = false;

        reject(
          new Error(
            `Redis connection failed after ${config.redis.retry_limit} retries.`,
          ),
        );
      };

      // Register listeners before initiating the connection.
      client.once('ready', onReady);
      client.once('end', onEnd);

      // Let retryStrategy manage subsequent connection attempts.
      client.connect().catch((error: Error) => {
        this.logger.warn(
          `Initial Redis connection attempt failed: ${error.message}. Waiting for retries...`,
        );
      });
    });
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
