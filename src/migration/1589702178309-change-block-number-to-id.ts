import {MigrationInterface, QueryRunner} from "typeorm";

export class changeBlockNumberToId1589702178309 implements MigrationInterface {
    name = 'changeBlockNumberToId1589702178309'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "block" ADD "id" SERIAL NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "block" DROP CONSTRAINT "PK_38414873c187a3e0c7943bc4c7b"`, undefined);
        await queryRunner.query(`ALTER TABLE "block" ADD CONSTRAINT "PK_67a5132ca63f5a1a2ad584a22c2" PRIMARY KEY ("number", "id")`, undefined);
        await queryRunner.query(`ALTER TABLE "block" DROP CONSTRAINT "PK_67a5132ca63f5a1a2ad584a22c2"`, undefined);
        await queryRunner.query(`ALTER TABLE "block" ADD CONSTRAINT "PK_d0925763efb591c2e2ffb267572" PRIMARY KEY ("id")`, undefined);
        await queryRunner.query(`ALTER TABLE "block" DROP COLUMN "number"`, undefined);
        await queryRunner.query(`ALTER TABLE "block" ADD "number" bigint NOT NULL DEFAULT 0`, undefined);
        await queryRunner.query(`ALTER TABLE "block" DROP COLUMN "timestamp"`, undefined);
        await queryRunner.query(`ALTER TABLE "block" ADD "timestamp" integer NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "block" DROP COLUMN "timestamp"`, undefined);
        await queryRunner.query(`ALTER TABLE "block" ADD "timestamp" bigint NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "block" DROP COLUMN "number"`, undefined);
        await queryRunner.query(`ALTER TABLE "block" ADD "number" SERIAL NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "block" DROP CONSTRAINT "PK_d0925763efb591c2e2ffb267572"`, undefined);
        await queryRunner.query(`ALTER TABLE "block" ADD CONSTRAINT "PK_67a5132ca63f5a1a2ad584a22c2" PRIMARY KEY ("number", "id")`, undefined);
        await queryRunner.query(`ALTER TABLE "block" DROP CONSTRAINT "PK_67a5132ca63f5a1a2ad584a22c2"`, undefined);
        await queryRunner.query(`ALTER TABLE "block" ADD CONSTRAINT "PK_38414873c187a3e0c7943bc4c7b" PRIMARY KEY ("number")`, undefined);
        await queryRunner.query(`ALTER TABLE "block" DROP COLUMN "id"`, undefined);
    }

}
