import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1587433615649 implements MigrationInterface {
    name = 'initial1587433615649'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "block" ("number" SERIAL NOT NULL, "hash" character varying(66) NOT NULL, "epochNumber" bigint NOT NULL DEFAULT 0, "epochIndex" bigint NOT NULL DEFAULT 0, "epochLength" bigint NOT NULL DEFAULT 0, "timestamp" bigint NOT NULL, "dao" character varying(66) NOT NULL, "transactionCount" integer NOT NULL, CONSTRAINT "PK_38414873c187a3e0c7943bc4c7b" PRIMARY KEY ("number"))`, undefined);
        await queryRunner.query(`CREATE TABLE "cell" ("id" SERIAL NOT NULL, "capacity" bigint NOT NULL, "address" character varying NOT NULL, "txHash" character varying NOT NULL, "index" character varying NOT NULL, "isLive" boolean NOT NULL, CONSTRAINT "PK_6f34717c251843e5ca32fc1b2b8" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "syncstat" ("id" SERIAL NOT NULL, "tip" bigint NOT NULL, CONSTRAINT "PK_97a4a78951d45dcdb897d1a1060" PRIMARY KEY ("id"))`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "syncstat"`, undefined);
        await queryRunner.query(`DROP TABLE "cell"`, undefined);
        await queryRunner.query(`DROP TABLE "block"`, undefined);
    }

}
