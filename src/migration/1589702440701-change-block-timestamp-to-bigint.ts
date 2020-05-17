import {MigrationInterface, QueryRunner} from "typeorm";

export class changeBlockTimestampToBigint1589702440701 implements MigrationInterface {
    name = 'changeBlockTimestampToBigint1589702440701'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "block" DROP COLUMN "timestamp"`, undefined);
        await queryRunner.query(`ALTER TABLE "block" ADD "timestamp" bigint NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "block" DROP COLUMN "timestamp"`, undefined);
        await queryRunner.query(`ALTER TABLE "block" ADD "timestamp" integer NOT NULL`, undefined);
    }

}
