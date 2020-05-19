import {MigrationInterface, QueryRunner} from "typeorm";

export class removeAddressFromAddress1589872171212 implements MigrationInterface {
    name = 'removeAddressFromAddress1589872171212'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "address"`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" ALTER COLUMN "typeArgs" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" ALTER COLUMN "typeCodeHash" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" ALTER COLUMN "typeHashType" SET DEFAULT null`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cell" ALTER COLUMN "typeHashType" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" ALTER COLUMN "typeCodeHash" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" ALTER COLUMN "typeArgs" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "address" ADD "address" character varying NOT NULL`, undefined);
    }

}
