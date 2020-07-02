import {MigrationInterface, QueryRunner} from "typeorm";

export class typehash1593664141738 implements MigrationInterface {
    name = 'typehash1593664141738'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cell" ADD "typeHash" character varying DEFAULT null`, undefined);
        await queryRunner.query(`CREATE INDEX "idx-cell-typeHash" ON "cell" ("typeHash") `, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "idx-cell-typeHash"`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" DROP COLUMN "typeHash"`, undefined);
    }

}
