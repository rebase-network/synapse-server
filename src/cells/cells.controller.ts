import { Controller, Get } from '@nestjs/common';

@Controller('cells')
export class CellsController {
  @Get()
  findAll(): string {
    return 'return all cells'
  }
  @Get('one')
  findOne(): string {
    return 'return one cell'
  }
}
