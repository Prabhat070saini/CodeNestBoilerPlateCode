import { IMongoMigration } from './migration.interface';

const migration: IMongoMigration = {
  async up(db) {
    await db.collection('testing').updateMany({}, { $set: { age: 0 } });
  },

  async down(db) {
    await db.collection('testing').updateMany({}, { $unset: { age: '' } });
  },
};

export default migration;
