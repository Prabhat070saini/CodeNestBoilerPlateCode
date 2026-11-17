import { existsSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const description = process.argv[2]
  ?.trim()
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

if (!description) {
  throw new Error(
    'Provide a description. Example: npm run mongo:migration:create -- work done',
  );
}

const timestamp = new Date()
  .toISOString()
  .replace(/[-:TZ.]/g, '')
  .slice(0, 14);
const migrationsDirectory = join(
  process.cwd(),
  'src',
  'core',
  'database',
  'no_sql',
  'migrations',
);
const fileName = `${timestamp}-${description}.migration.ts`;
const filePath = join(migrationsDirectory, fileName);

if (existsSync(filePath)) {
  throw new Error(`Migration already exists: ${fileName}`);
}

const template = `import { IMongoMigration } from './migration.interface';

const migration: IMongoMigration = {
  async up(db) {
    // Apply the database change here.
    // Example: await db.collection('testing').updateMany({}, { $set: { age: 0 } });
  },

  async down(db) {
    // Revert the database change here.
    // Example: await db.collection('testing').updateMany({}, { $unset: { age: '' } });
  },
};

export default migration;
`;

writeFileSync(filePath, template);
/* eslint-disable-next-line no-console */
console.log(`Created MongoDB migration: ${relative(process.cwd(), filePath)}`);
