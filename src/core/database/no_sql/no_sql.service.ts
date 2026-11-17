import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { MONGODB_DATABASE_CONNECTION } from '../../../common/constants/app.constant';

@Injectable()
export class NoSqlDatabaseShutdownService implements OnApplicationShutdown {
  private readonly logger = new Logger(NoSqlDatabaseShutdownService.name);

  constructor(
    @InjectConnection(MONGODB_DATABASE_CONNECTION)
    private readonly connection: Connection,
  ) {}

  async onApplicationShutdown(signal?: string): Promise<void> {
    if (this.connection.readyState === 0) {
      return;
    }

    this.logger.log(
      `Closing MongoDB connection due to signal: ${signal ?? 'manual stop'}`,
    );
    await this.connection.close();
    this.logger.log('MongoDB connection closed gracefully');
  }
}
