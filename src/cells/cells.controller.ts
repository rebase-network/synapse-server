import { Controller, Get, Post } from '@nestjs/common';

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
  @Get('one')
  findOne(): string {
    return 'return one cell'
  }
}
