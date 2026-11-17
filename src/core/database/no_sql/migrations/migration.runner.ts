import { Logger } from '@nestjs/common';
import { createConnection, mongo } from 'mongoose';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { config } from '../../../../config/config';
import { IMongoMigration } from './migration.interface';

type MigrationRecord = {
  name: string;
  appliedAt: Date;
};

const MIGRATIONS_COLLECTION = '_mongo_migrations';
const migrationDirectory = __dirname;
const logger = new Logger('MongoMigration');

function getMigrationFiles(): string[] {
  return readdirSync(migrationDirectory)
    .filter((file) => file.endsWith('.migration.js'))
    .sort();
}

async function loadMigration(file: string): Promise<IMongoMigration> {
  const migration = (await import(
    pathToFileURL(join(migrationDirectory, file)).href
  )) as {
    default?: IMongoMigration;
  };

  if (!migration.default?.up || !migration.default?.down) {
    throw new Error(
      `${file} must export a default migration with up() and down()`,
    );
  }

  return migration.default;
}

async function runUp(db: mongo.Db): Promise<void> {
  const migrationCollection = db.collection<MigrationRecord>(
    MIGRATIONS_COLLECTION,
  );
  const appliedMigrations = await migrationCollection.distinct('name');
  const pendingFiles = getMigrationFiles().filter(
    (file) => !appliedMigrations.includes(file),
  );

  if (pendingFiles.length === 0) {
    logger.log('No pending MongoDB migrations');
    return;
  }

  for (const file of pendingFiles) {
    logger.log(`Applying ${file}`);
    await (await loadMigration(file)).up(db);
    await migrationCollection.insertOne({ name: file, appliedAt: new Date() });
    logger.log(`Applied ${file}`);
  }
}

async function runDown(db: mongo.Db): Promise<void> {
  const migrationCollection = db.collection<MigrationRecord>(
    MIGRATIONS_COLLECTION,
  );
  const latestMigration = await migrationCollection.findOne(
    {},
    { sort: { appliedAt: -1 } },
  );

  if (!latestMigration) {
    logger.log('No applied MongoDB migrations to roll back');
    return;
  }

  logger.log(`Rolling back ${latestMigration.name}`);
  await (await loadMigration(latestMigration.name)).down(db);
  await migrationCollection.deleteOne({ _id: latestMigration._id });
  logger.log(`Rolled back ${latestMigration.name}`);
}

async function showStatus(db: mongo.Db): Promise<void> {
  const migrationCollection = db.collection<MigrationRecord>(
    MIGRATIONS_COLLECTION,
  );
  const appliedMigrations = new Set(await migrationCollection.distinct('name'));

  for (const file of getMigrationFiles()) {
    logger.log(
      `${appliedMigrations.has(file) ? 'APPLIED' : 'PENDING'}  ${file}`,
    );
  }
}

async function bootstrap(): Promise<void> {
  const command = process.argv[2] ?? 'up';
  const connection = createConnection(config.mongodb.uri, {
    maxPoolSize: 1,
    minPoolSize: 0,
    serverSelectionTimeoutMS: config.mongodb.server_selection_timeout_ms,
    connectTimeoutMS: config.mongodb.connect_timeout_ms,
  });

  try {
    await connection.asPromise();
    if (!connection.db) {
      throw new Error('MongoDB connection did not provide a database instance');
    }

    if (command === 'up') await runUp(connection.db);
    else if (command === 'down') await runDown(connection.db);
    else if (command === 'status') await showStatus(connection.db);
    else throw new Error(`Unknown migration command: ${command}`);
  } finally {
    await connection.close();
  }
}

void bootstrap().catch((error: unknown) => {
  logger.error('MongoDB migration failed', error);
  process.exitCode = 1;
});
