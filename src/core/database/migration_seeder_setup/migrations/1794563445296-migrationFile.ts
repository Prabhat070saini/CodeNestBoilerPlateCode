import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationFile1794563445296 implements MigrationInterface {
  name = 'MigrationFile1794563445296';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "dbo"."users" ("id" SERIAL NOT NULL, "user_id" character varying(26) NOT NULL, "name" character varying(255), "email" character varying(255) NOT NULL, "phone" character varying(15), "role" character varying(15), "is_active" boolean NOT NULL DEFAULT true, "password" text NOT NULL, "created_by" integer NOT NULL, "last_login" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, CONSTRAINT "UQ_96aac72f1574b88752e9fb00089" UNIQUE ("user_id"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_96aac72f1574b88752e9fb0008" ON "dbo"."users" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "dbo"."users" ("email") `,
    );
    await queryRunner.query(
      `CREATE TABLE "dbo"."books" ("id" SERIAL NOT NULL, "book_id" character varying(26) NOT NULL, "discription" character varying(255), "author" character varying(255) NOT NULL, "title" character varying(15), "year_of_publish" character varying(15), "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, CONSTRAINT "UQ_552bd343dabd693159e284fe517" UNIQUE ("book_id"), CONSTRAINT "UQ_4675aad2c57a7a793d26afbae99" UNIQUE ("author"), CONSTRAINT "PK_f3f2f25a099d24e12545b70b022" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_552bd343dabd693159e284fe51" ON "dbo"."books" ("book_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_4675aad2c57a7a793d26afbae9" ON "dbo"."books" ("author") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "dbo"."IDX_4675aad2c57a7a793d26afbae9"`,
    );
    await queryRunner.query(
      `DROP INDEX "dbo"."IDX_552bd343dabd693159e284fe51"`,
    );
    await queryRunner.query(`DROP TABLE "dbo"."books"`);
    await queryRunner.query(
      `DROP INDEX "dbo"."IDX_97672ac88f789774dd47f7c8be"`,
    );
    await queryRunner.query(
      `DROP INDEX "dbo"."IDX_96aac72f1574b88752e9fb0008"`,
    );
    await queryRunner.query(`DROP TABLE "dbo"."users"`);
  }
}
