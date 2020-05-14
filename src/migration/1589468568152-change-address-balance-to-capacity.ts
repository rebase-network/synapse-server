import {MigrationInterface, QueryRunner} from "typeorm";

export class changeAddressBalanceToCapacity1589468568152 implements MigrationInterface {
    name = 'changeAddressBalanceToCapacity1589468568152'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" RENAME COLUMN "balance" TO "capacity"`, undefined);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "capacity"`, undefined);
        await queryRunner.query(`ALTER TABLE "address" ADD "capacity" bigint NOT NULL DEFAULT 0`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "capacity"`, undefined);
        await queryRunner.query(`ALTER TABLE "address" ADD "capacity" bigint NOT NULL DEFAULT 0`, undefined);
        await queryRunner.query(`ALTER TABLE "address" RENAME COLUMN "capacity" TO "balance"`, undefined);
    }

}
