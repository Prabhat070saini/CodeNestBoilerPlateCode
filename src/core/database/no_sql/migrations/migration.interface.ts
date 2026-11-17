import { mongo } from 'mongoose';

export interface IMongoMigration {
  up(db: mongo.Db): Promise<void>;
  down(db: mongo.Db): Promise<void>;
}
