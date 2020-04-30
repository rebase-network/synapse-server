import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { CellService } from './cell.service';
import { LoggingInterceptor } from '../logging.interceptor';

@Controller('cell')
@UseInterceptors(LoggingInterceptor)
export class CellController {
  constructor(private readonly cellService: CellService) {}

  @Get('getBalanceByPubkeyHash/:pubkeyHash')
  async getBalanceByPubkeyHash(@Param('pubkeyHash') pubkeyHash: string): Promise<number> {
    return await this.cellService.getBalanceByPubkeyHash(pubkeyHash)
  }

  @Get('getBalanceByAddress/:address')
  async getBalanceByAddress(@Param('address') address: string): Promise<number> {
    return await this.cellService.getBalanceByAddress(address)
  }
}
