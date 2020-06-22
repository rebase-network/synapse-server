import {MigrationInterface, QueryRunner} from "typeorm";

export class addIndex1592817412832 implements MigrationInterface {
    name = 'addIndex1592817412832'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "idx-cell-typeArgs" ON "cell" ("typeArgs") `, undefined);
        await queryRunner.query(`CREATE INDEX "idx-cell-typeCodeHash" ON "cell" ("typeCodeHash") `, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "idx-cell-typeCodeHash"`, undefined);
        await queryRunner.query(`DROP INDEX "idx-cell-typeArgs"`, undefined);
    }

}
