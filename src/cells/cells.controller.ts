import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { CellsService } from './cells.service';
import { Cell } from './interfaces/cell.interface';
import { CreateCellDto } from './dto/create-cell.dto';

@Controller('cells')
export class CellsController {
  constructor(private readonly cellsService: CellsService) {}

  @Get()
  async findAll(): Promise<Cell[]> {
    return this.cellsService.findAll();
  }
  @Get('/cd')
  find(): Observable<any[]> {
    return of(['c', 'd'])
  }
  @Post()
  create(@Body() createCellDto: CreateCellDto) {
    this.cellsService.create(createCellDto);
  }
  @Get(':id')
  findOne(@Param() params): string {
    return `return one cell with id: ${params.id}`
  }
}
