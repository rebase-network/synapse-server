import {MigrationInterface, QueryRunner} from "typeorm";

export class addCell1587019770599 implements MigrationInterface {
    name = 'addCell1587019770599'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cell" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "lastChangedDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "capacity" integer NOT NULL, "lock" character varying NOT NULL, "type" character varying NOT NULL, "data" character varying NOT NULL, CONSTRAINT "PK_6f34717c251843e5ca32fc1b2b8" PRIMARY KEY ("id"))`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "cell"`, undefined);
    }

}
