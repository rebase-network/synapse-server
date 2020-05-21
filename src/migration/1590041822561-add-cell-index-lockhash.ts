/*
 * @Author: River
 * @Date: 2020-05-21 14:17:08
 * @LastEditTime: 2020-05-21 14:20:42
 */ 
import {MigrationInterface, QueryRunner} from "typeorm";

export class addCellIndexLockhash1590041822561 implements MigrationInterface {
    name = 'addCellIndexLockhash1590041822561'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cell" ADD "lockHash" character varying NOT NULL`, undefined);
        await queryRunner.query(`CREATE INDEX "idx-cell-lockHash" ON "cell" ("lockHash") `, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "idx-cell-lockHash"`, undefined);
        await queryRunner.query(`ALTER TABLE "cell" DROP COLUMN "lockHash"`, undefined);
    }

}
