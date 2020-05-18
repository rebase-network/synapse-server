import {MigrationInterface, QueryRunner} from "typeorm";

export class changeCellTable1589786269602 implements MigrationInterface {
    name = 'changeCellTable1589786269602'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cell" DROP COLUMN "isLive"`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" ADD "blockNumber" bigint NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" ADD "blockHash" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" ADD "timestamp" bigint NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" ADD "status" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" ADD "lockArgs" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" ADD "lockCodeHash" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" ADD "lockHashType" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" ADD "typeArgs" character varying DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" ADD "typeCodeHash" character varying DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" ADD "typeHashType" character varying DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" ADD "outputData" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" ADD "outputDataHash" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" ADD "outputDataLen" character varying NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cell" DROP COLUMN "outputDataLen"`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" DROP COLUMN "outputDataHash"`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" DROP COLUMN "outputData"`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" DROP COLUMN "typeHashType"`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" DROP COLUMN "typeCodeHash"`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" DROP COLUMN "typeArgs"`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" DROP COLUMN "lockHashType"`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" DROP COLUMN "lockCodeHash"`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" DROP COLUMN "lockArgs"`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" DROP COLUMN "status"`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" DROP COLUMN "timestamp"`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" DROP COLUMN "blockHash"`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" DROP COLUMN "blockNumber"`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" ADD "isLive" boolean NOT NULL`, undefined);
    }

}
