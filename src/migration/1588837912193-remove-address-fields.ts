import {MigrationInterface, QueryRunner} from "typeorm";

export class removeAddressFields1588837912193 implements MigrationInterface {
    name = 'removeAddressFields1588837912193'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "pubKeyHash"`, undefined);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "lockHash"`, undefined);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "balance"`, undefined);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "liveCellCount"`, undefined);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "txCount"`, undefined);
        await queryRunner.query(`ALTER TABLE "address" ADD "balance" bigint NOT NULL DEFAULT 0`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "balance"`, undefined);
        await queryRunner.query(`ALTER TABLE "address" ADD "txCount" bigint NOT NULL DEFAULT 0`, undefined);
        await queryRunner.query(`ALTER TABLE "address" ADD "liveCellCount" bigint NOT NULL DEFAULT 0`, undefined);
        await queryRunner.query(`ALTER TABLE "address" ADD "balance" bigint NOT NULL DEFAULT 0`, undefined);
        await queryRunner.query(`ALTER TABLE "address" ADD "lockHash" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "address" ADD "pubKeyHash" character varying NOT NULL`, undefined);
    }

}
