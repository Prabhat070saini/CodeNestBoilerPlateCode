import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationFile1762429933037 implements MigrationInterface {
  name = 'MigrationFile1762429933037';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_96aac72f1574b88752e9fb0008" ON "dbo"."users" ("user_id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "dbo"."IDX_96aac72f1574b88752e9fb0008"`,
    );
  }
}
