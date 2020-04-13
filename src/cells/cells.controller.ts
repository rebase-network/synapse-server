import { Controller, Get, Post, Param } from '@nestjs/common';

@Controller('cells')
export class CellsController {
  @Get()
  findAll(): string {
    return 'return all cells'
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
