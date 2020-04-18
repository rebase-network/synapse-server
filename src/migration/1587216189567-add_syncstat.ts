import {MigrationInterface, QueryRunner} from "typeorm";

export class addSyncstat1587216189567 implements MigrationInterface {
    name = 'addSyncstat1587216189567'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "block" ("number" SERIAL NOT NULL, "hash" character varying(66) NOT NULL, "epochNumber" bigint NOT NULL DEFAULT 0, "epochIndex" bigint NOT NULL DEFAULT 0, "epochLength" bigint NOT NULL DEFAULT 0, "timestamp" bigint NOT NULL, "dao" character varying(66) NOT NULL, "transactionCount" integer NOT NULL, CONSTRAINT "PK_38414873c187a3e0c7943bc4c7b" PRIMARY KEY ("number"))`, undefined);
        await queryRunner.query(`CREATE TABLE "syncstat" ("id" SERIAL NOT NULL, "tip" bigint NOT NULL, CONSTRAINT "PK_97a4a78951d45dcdb897d1a1060" PRIMARY KEY ("id"))`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "syncstat"`, undefined);
        await queryRunner.query(`DROP TABLE "block"`, undefined);
    }

}
