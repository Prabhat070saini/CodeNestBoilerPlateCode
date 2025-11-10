import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationFile1762430072388 implements MigrationInterface {
  name = 'MigrationFile1762430072388';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "dbo"."IDX_96aac72f1574b88752e9fb0008"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."users" DROP CONSTRAINT "UQ_96aac72f1574b88752e9fb00089"`,
    );
    await queryRunner.query(`ALTER TABLE "dbo"."users" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "dbo"."users" ADD "user_id" character varying(26) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."users" ADD CONSTRAINT "UQ_96aac72f1574b88752e9fb00089" UNIQUE ("user_id")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_96aac72f1574b88752e9fb0008" ON "dbo"."users" ("user_id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "dbo"."IDX_96aac72f1574b88752e9fb0008"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."users" DROP CONSTRAINT "UQ_96aac72f1574b88752e9fb00089"`,
    );
    await queryRunner.query(`ALTER TABLE "dbo"."users" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "dbo"."users" ADD "user_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."users" ADD CONSTRAINT "UQ_96aac72f1574b88752e9fb00089" UNIQUE ("user_id")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_96aac72f1574b88752e9fb0008" ON "dbo"."users" ("user_id") `,
    );
  }
}
