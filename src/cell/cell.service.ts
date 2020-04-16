import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cell as CellEntiry } from '../model/cell.entity';
import { Repository } from 'typeorm';
import { Cell } from './interfaces/cell.interface';

@Injectable()
export class CellService {
  constructor(@InjectRepository(CellEntiry) private readonly repo: Repository<CellEntiry>) { }

  public async getAll() {
    return await this.repo.find();
  }

  public async create(cell: Cell): Promise<Cell> {
    return await this.repo.create(cell)
  }
}
