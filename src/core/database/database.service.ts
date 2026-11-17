import {
  Inject,
  Injectable,
  Logger,
  OnApplicationShutdown,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TYPEORM_DATABASE_PROVIDER } from '../../common/constants/app.constant';

@Injectable()
export class DatabaseShutdownService implements OnApplicationShutdown {
  private readonly logger = new Logger(DatabaseShutdownService.name);

  constructor(
    @Inject(TYPEORM_DATABASE_PROVIDER)
    private readonly dataSource: DataSource,
  ) {}

  async onApplicationShutdown(signal?: string): Promise<void> {
    this.logger.log(
      `[DatabaseModule] Shutting down due to signal: ${signal ?? 'manual stop'}`,
    );

    try {
      if (this.dataSource?.isInitialized) {
        await this.dataSource.destroy();
        this.logger.log('Database connection closed gracefully');
      }
    } catch (error) {
      this.logger.error('Error while closing database connection:', error);
    }
  }
}
