import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cell as CellEntity } from '../model/cell.entity';
import { Cell } from './interfaces/cell.interface';

@Injectable()
export class CellService {
  constructor(@InjectRepository(CellEntity) private readonly repo: Repository<CellEntity>) { }

  public async getAll() {
    return await this.repo.find();
  }

  public async create(cell: Cell): Promise<Cell> {
    return await this.repo.save(cell)
  }
}
