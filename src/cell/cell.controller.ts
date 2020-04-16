import { Controller, Get, Post, Param, Body, UseInterceptors } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { CellService } from './cell.service';
import { Cell } from './interfaces/cell.interface';
import { CreateCellDto } from './dto/create-cell.dto';
import { LoggingInterceptor } from '../logging.interceptor';

@Controller('cell')
@UseInterceptors(LoggingInterceptor)
export class CellController {
  constructor(private readonly cellService: CellService) {}

  @Get()
  getAll() {
    return this.cellService.getAll();
  }

  @Get('/cd')
  find(): Observable<any[]> {
    return of(['c', 'd'])
  }

  @Post()
  create(@Body() createCellDto: CreateCellDto) {
    this.cellService.create(createCellDto);
  }

  @Get(':id')
  findOne(@Param() params): string {
    return `return one cell with id: ${params.id}`
  }
}
