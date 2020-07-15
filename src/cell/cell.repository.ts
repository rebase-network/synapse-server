import { Repository, EntityRepository } from 'typeorm';
import { Cell } from '../model/cell.entity';

@EntityRepository(Cell)
export class CellRepository extends Repository<Cell> {
  public async queryByQueryObjAndCapacity(queryObj, capacity) {
    return await this.createQueryBuilder('cell')
      .where(queryObj)
      .andWhere('cell.capacity >:sendCapactity', {
        sendCapactity: capacity,
      })
      .getOne();
  }

  public async queryByQueryObjAndStepPage(queryObj, step, page) {
    return await this.createQueryBuilder('cell')
      .where(queryObj)
      .orderBy('cell.capacity', 'DESC')
      .limit(step)
      .offset(step * page);
  }

  public async queryCellsByLockHashAndTypeScript(
    lockHash,
    typeHashType,
    typeCodeHash,
    typeArgs,
  ) {
    return await this.createQueryBuilder('cell')
      .where('cell.lockHash = :lockHash', {
        lockHash: lockHash,
      })
      .andWhere('cell.typeHashType = :typeHashType', {
        typeHashType: typeHashType,
      })
      .andWhere('cell.typeCodeHash =  :typeCodeHash', {
        typeCodeHash: typeCodeHash,
      })
      .andWhere('cell.typeArgs =  :typeArgs', {
        typeArgs: typeArgs,
      })
      .andWhere("cell.status = 'live'")
      .getMany();
  }

  public async queryCellsByLockHashAndTypeHash(lockHash, typeHash) {
    return await this.createQueryBuilder('cell')
      .where('cell.lockHash = :lockHash', {
        lockHash: lockHash,
      })
      .andWhere('cell.typeHash = :typeHash', {
        typeHash: typeHash,
      })
      .andWhere("cell.status = 'live'")
      .getMany();
  }

  public async queryFreeCellsByLockHash(lockHash) {
    return await this.createQueryBuilder('cell')
      .where('cell.lockHash = :lockHash', {
        lockHash: lockHash,
      })
      .andWhere("cell.status = 'live'")
      .andWhere('cell.typeCodeHash is null')
      .andWhere('cell.outputData =  :outputData', {
        outputData: '0x',
      })
      .getMany();
  }

  public async queryCellsByLockHash(lockHash,step,page) {
    console.log('repository queryCellsByLockHash');
    return await this.createQueryBuilder('cell')
      .where('cell.lockHash = :lockHash', {
        lockHash: lockHash,
      })
      .andWhere("cell.status = 'live'")
      .orderBy('cell.timestamp', 'DESC')
      .limit(step)
      .offset(step * page)
      .getMany();
  }
}
