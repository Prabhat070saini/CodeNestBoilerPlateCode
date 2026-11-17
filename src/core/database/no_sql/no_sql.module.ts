import { Global, Logger, Module } from '@nestjs/common';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { MONGODB_DATABASE_CONNECTION } from '../../../common/constants/app.constant';
import { config } from '../../../config/config';
import { NoSqlDatabaseShutdownService } from './no_sql.service';
import { MONGODB_SCHEMAS } from './no_sql.schemas.generated';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      connectionName: MONGODB_DATABASE_CONNECTION,
      useFactory: (): MongooseModuleFactoryOptions => {
        const logger = new Logger('MongoDB');

        return {
          uri: config.mongodb.uri,
          maxPoolSize: config.mongodb.max_pool_size,
          minPoolSize: config.mongodb.min_pool_size,
          serverSelectionTimeoutMS: config.mongodb.server_selection_timeout_ms,
          connectTimeoutMS: config.mongodb.connect_timeout_ms,
          socketTimeoutMS: config.mongodb.socket_timeout_ms,
          heartbeatFrequencyMS: config.mongodb.heartbeat_frequency_ms,
          retryWrites: true,
          retryReads: true,
          compressors: ['zlib'],
          // Collection and index changes must be applied explicitly with
          // `npm run mongo:sync-indexes`, never during application startup.
          autoIndex: false,
          autoCreate: false,
          retryAttempts: config.mongodb.retry_attempts,
          retryDelay: config.mongodb.retry_delay_ms,
          connectionFactory: (connection: Connection): Connection => {
            connection.on('connected', () => logger.log('Connected'));
            connection.on('disconnected', () => logger.warn('Disconnected'));
            connection.on('reconnected', () => logger.log('Reconnected'));
            connection.on('error', (error: Error) =>
              logger.error(`Error: ${error.message}`, error.stack),
            );
            return connection;
          },
        };
      },
    }),
    MongooseModule.forFeature(MONGODB_SCHEMAS, MONGODB_DATABASE_CONNECTION),
  ],
  providers: [NoSqlDatabaseShutdownService],
  exports: [MongooseModule],
})
export class NoSqlDatabaseModule {}
