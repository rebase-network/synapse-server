import {MigrationInterface, QueryRunner} from "typeorm";

export class addAddress1588755254737 implements MigrationInterface {
    name = 'addAddress1588755254737'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "address" ("id" SERIAL NOT NULL, "pubKeyHash" character varying NOT NULL, "lockHash" character varying NOT NULL, "address" character varying NOT NULL, "balance" bigint NOT NULL DEFAULT 0, "liveCellCount" bigint NOT NULL DEFAULT 0, "txCount" bigint NOT NULL DEFAULT 0, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "address"`, undefined);
    }

}
