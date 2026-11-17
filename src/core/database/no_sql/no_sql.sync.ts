import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MONGODB_DATABASE_CONNECTION } from '../../../common/constants/app.constant';
import { NoSqlDatabaseModule } from './no_sql.module';
import { MONGODB_SCHEMAS } from './no_sql.schemas.generated';

async function syncIndexes(): Promise<void> {
  const logger = new Logger('MongoDbIndexSync');
  const app = await NestFactory.createApplicationContext(NoSqlDatabaseModule);

  try {
    for (const { name } of MONGODB_SCHEMAS) {
      const model = app.get<Model<unknown>>(
        getModelToken(name, MONGODB_DATABASE_CONNECTION),
      );
      await model.syncIndexes();
      logger.log(`Indexes synchronized for ${name}`);
    }
  } finally {
    await app.close();
  }
}

void syncIndexes().catch((error: unknown) => {
  const logger = new Logger('MongoDbIndexSync');
  logger.error('MongoDB index synchronization failed', error);
  process.exitCode = 1;
});
