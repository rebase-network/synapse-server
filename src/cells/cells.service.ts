import { Injectable } from '@nestjs/common';
import { Cell } from './interfaces/cell.interface'

@Injectable()
export class CellsService {
  private readonly cells: Cell[] = [];

  create(cell: Cell) {
    this.cells.push(cell);
  }

  findAll(): Cell[] {
    return this.cells;
  }
}
