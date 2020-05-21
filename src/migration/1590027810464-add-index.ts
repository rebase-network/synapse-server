import {MigrationInterface, QueryRunner} from "typeorm";

export class addIndex1590027810464 implements MigrationInterface {
    name = 'addIndex1590027810464'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "idx-address-lockHash" ON "address" ("lockHash") `, undefined);
        await queryRunner.query(`CREATE INDEX "idx-address-lockArgs" ON "address" ("lockArgs") `, undefined);
        await queryRunner.query(`CREATE INDEX "idx-block-hash" ON "block" ("hash") `, undefined);
        await queryRunner.query(`CREATE INDEX "idx-cell-blockHash" ON "cell" ("blockHash") `, undefined);
        await queryRunner.query(`CREATE INDEX "idx-cell-txHash" ON "cell" ("txHash") `, undefined);
        await queryRunner.query(`CREATE INDEX "idx-cell-lockArgs" ON "cell" ("lockArgs") `, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "idx-cell-lockArgs"`, undefined);
        await queryRunner.query(`DROP INDEX "idx-cell-txHash"`, undefined);
        await queryRunner.query(`DROP INDEX "idx-cell-blockHash"`, undefined);
        await queryRunner.query(`DROP INDEX "idx-block-hash"`, undefined);
        await queryRunner.query(`DROP INDEX "idx-address-lockArgs"`, undefined);
        await queryRunner.query(`DROP INDEX "idx-address-lockHash"`, undefined);
    }

}
