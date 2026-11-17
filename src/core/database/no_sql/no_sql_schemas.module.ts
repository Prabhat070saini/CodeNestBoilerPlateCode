import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGODB_DATABASE_CONNECTION } from '../../../common/constants/app.constant';
import { NoSqlDatabaseModule } from './no_sql.module';
import { MONGODB_SCHEMAS } from './no_sql.schemas.generated';

@Global()
@Module({
  imports: [
    NoSqlDatabaseModule,
    MongooseModule.forFeature(MONGODB_SCHEMAS, MONGODB_DATABASE_CONNECTION),
  ],
  exports: [MongooseModule],
})
export class NoSqlSchemasModule {}
