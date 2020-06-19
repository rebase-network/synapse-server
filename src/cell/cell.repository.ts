import { Repository, EntityRepository } from 'typeorm';
import { Cell } from '../model/cell.entity';

@EntityRepository(Cell)
export class CellRepository extends Repository<Cell> {

  public async queryByQueryObjAndCapacity(queryObj, capacity){
   return await this.createQueryBuilder('cell')
      .where(queryObj)
      .andWhere('cell.capacity >:sendCapactity', {
        sendCapactity: capacity,
      })
      .getOne();
  }

  public async queryByQueryObjAndStepPage(queryObj, step, page){
   return await this.createQueryBuilder('cell')
    .where(queryObj)
    .orderBy('cell.capacity', 'DESC')
    .limit(step).offset(step * page)
  }

}
