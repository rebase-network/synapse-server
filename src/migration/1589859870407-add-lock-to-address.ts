import {MigrationInterface, QueryRunner} from "typeorm";

export class addLockToAddress1589859870407 implements MigrationInterface {
    name = 'addLockToAddress1589859870407'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" ADD "lockHash" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "address" ADD "lockArgs" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "address" ADD "lockCodeHash" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "address" ADD "lockHashType" character varying NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "lockHashType"`, undefined);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "lockCodeHash"`, undefined);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "lockArgs"`, undefined);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "lockHash"`, undefined);
    }

}
