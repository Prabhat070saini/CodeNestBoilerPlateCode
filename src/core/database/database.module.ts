import { Global, Module } from '@nestjs/common';
import { DatabaseConfig } from './database.config';
import { CAN_DATABASE_PROVIDER } from './database.provider';
import { NoSqlDatabaseModule } from './no_sql/no_sql.module';
import { DatabaseShutdownService } from './database.service';
@Global()
@Module({
  imports: [NoSqlDatabaseModule],
  providers: [
    DatabaseConfig,
    ...CAN_DATABASE_PROVIDER,
    DatabaseShutdownService,
  ],
  exports: [...CAN_DATABASE_PROVIDER],
})
export class DatabaseModule {}
