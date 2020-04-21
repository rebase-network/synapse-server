import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cell as CellEntity } from '../model/cell.entity';
import { Cell } from './interfaces/cell.interface';

@Injectable()
export class CellService {
  constructor(@InjectRepository(CellEntity) private readonly repo: Repository<CellEntity>) { }

  public async getBalanceByAddress(address: string): Promise<number> {
    const queryObj = {
      address,
      isLive: true,
    }
    const liveCells = await this.repo.find(queryObj);

    if (liveCells.length === 0) return 0;

    const result = liveCells.reduce((pre, cur, index, arr) => {
      return pre + Number(cur.capacity)
    }, 0)

    return result;
  }

  public async create(cell: Cell): Promise<Cell> {
    return await this.repo.save(cell)
  }
}
