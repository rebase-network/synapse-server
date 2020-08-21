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

  public async queryByQueryObjAndStepPage(queryObj, step, page, typeHash) {
    if (typeHash === null) {
      return await this.createQueryBuilder('cell')
        .where(queryObj)
        .andWhere('cell.typeHash is null')
        .orderBy('cell.capacity', 'DESC')
        .limit(step)
        .offset(step * page);
    } else {
      return await this.createQueryBuilder('cell')
        .where(queryObj)
        .orderBy('cell.capacity', 'DESC')
        .limit(step)
        .offset(step * page);
    }
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

  public async queryCellsByLockHash(lockHash) {
    return await this.createQueryBuilder('cell')
      .where('cell.lockHash = :lockHash', {
        lockHash: lockHash,
      })
      .andWhere("cell.status = 'live'")
      .getMany();
  }
  public async queryCellsByLockHashAndTypeHashes(lockHash, typeHashes) {
    return await this.createQueryBuilder('cell')
      .where('cell.lockHash = :lockHash', {
        lockHash: lockHash,
      })
      .where('cell.typeHash IN (:...typeHashes)', { typeHashes: typeHashes })
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

  public async queryCellsByLockHashPage(lockHash, page = 0, step = 20) {
    console.log('repository queryCellsByLockHash');
    return await this.createQueryBuilder('cell')
      .where('cell.lockHash = :lockHash', {
        lockHash: lockHash,
      })
      .orderBy('cell.timestamp', 'DESC')
      .limit(step)
      .offset(step * page)
      .getMany();
  }

  public async queryEmptyCapacity(queryObj) {
    return this.createQueryBuilder('cell')
      .select('SUM(cell.capacity)', 'totalCapacity')
      .where(queryObj)
      .getRawOne();
  }
}
