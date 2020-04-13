import { Controller, Get, Post, Param } from '@nestjs/common';
import { Observable, of } from 'rxjs';

@Controller('cells')
export class CellsController {
  @Get()
  async findAll(): Promise<any[]> {
    return ['aaa', 'bbb']
  }
  @Get('/cd')
  find(): Observable<any[]> {
    return of(['c', 'd'])
  }
  @Post()
  create(): string {
    return 'create a cell'
  }
  @Get(':id')
  findOne(@Param() params): string {
    return `return one cell with id: ${params.id}`
  }
}
