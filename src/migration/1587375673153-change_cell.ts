import {MigrationInterface, QueryRunner} from "typeorm";

export class changeCell1587375673153 implements MigrationInterface {
    name = 'changeCell1587375673153'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cell" DROP COLUMN "createDateTime"`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" DROP COLUMN "lastChangedDateTime"`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" DROP COLUMN "lock"`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" DROP COLUMN "type"`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" DROP COLUMN "data"`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" ADD "address" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" ADD "txHash" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" ADD "index" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" ADD "isLive" boolean NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" DROP CONSTRAINT "PK_6f34717c251843e5ca32fc1b2b8"`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" DROP COLUMN "id"`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" ADD "id" SERIAL NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" ADD CONSTRAINT "PK_6f34717c251843e5ca32fc1b2b8" PRIMARY KEY ("id")`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" DROP COLUMN "capacity"`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" ADD "capacity" bigint NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cell" DROP COLUMN "capacity"`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" ADD "capacity" integer NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" DROP CONSTRAINT "PK_6f34717c251843e5ca32fc1b2b8"`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" DROP COLUMN "id"`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" ADD CONSTRAINT "PK_6f34717c251843e5ca32fc1b2b8" PRIMARY KEY ("id")`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" DROP COLUMN "isLive"`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" DROP COLUMN "index"`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" DROP COLUMN "txHash"`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" DROP COLUMN "address"`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" ADD "data" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" ADD "type" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" ADD "lock" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" ADD "lastChangedDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" ADD "createDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP`, undefined);
    }

}
