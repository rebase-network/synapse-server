import { Controller, Get } from '@nestjs/common';
import { BlockService } from './block.service'

@Controller('block')
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @Get('/sync')
  sync() {
    return this.blockService.sync();
  }
}
