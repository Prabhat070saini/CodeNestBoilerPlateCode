import { DataSource } from 'typeorm';

export default class SchemaSeeder {
  public async run(dataSource: DataSource): Promise<void> {
    await dataSource.query(`
      CREATE SCHEMA IF NOT EXISTS "dbo";
    `);
  }
}
