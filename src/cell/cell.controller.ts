import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { CellService } from './cell.service';
import { LoggingInterceptor } from '../logging.interceptor';
import * as ckbUtils from '@nervosnetwork/ckb-sdk-utils';

@Controller('cell')
@UseInterceptors(LoggingInterceptor)
export class CellController {
  constructor(private readonly cellService: CellService) { }

  @Get('getBalanceByAddress/:address')
  async getBalanceByAddress(@Param('address') address: string): Promise<number> {
    const parsedHex = ckbUtils.bytesToHex(ckbUtils.parseAddress(address))
    const pubkeyHash = "0x" + parsedHex.toString().slice(6) // blake160

    return await this.cellService.getBalanceByPubkeyHash(pubkeyHash)
  }

  // @Get('getBalanceByAddress/:address')
  // async getBalanceByAddress(@Param('address') address: string): Promise<number> {
  //   return await this.cellService.getBalanceByAddress(address)
  // }

  // @Get('getTxByTxHash/:txHash')
  // async getTxByTxHash(@Param('txHash') txHash: string): Promise <any> {
  //   return await this.cellService.getTxByTxHash(txHash)
  // }

  // @Get('getHeaderByNum/:hexNum')
  // async getHeaderByNum(@Param('hexNum') hexNum: string): Promise <any> {
  //   return await this.cellService.getHeaderByNum(hexNum)
  // }

  @Get('getTxHistoryByAddress/:address')
  async getTxHistoryByAddress(@Param('address') address: string): Promise<any> {
    const parsedHex = ckbUtils.bytesToHex(ckbUtils.parseAddress(address))
    const pubkeyHash = "0x" + parsedHex.toString().slice(6)

    return await this.cellService.getTxsByPubkeyHash(pubkeyHash)
  }
}
