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

    const txs = await this.cellService.getTxHistoryByPubkeyHash(pubkeyHash)

    for (const tx of txs) {
      // Object.values(tx.inputs).map(item => item.capacity);
      // Object.values(tx.outputs).map(item => item.capacity);
      const inSum = tx.inputs.reduce((prev, next) => prev + next.capacity, 0)
      const outSum = tx.outputs.reduce((prev, next) => prev + next.capacity, 0)
      const fee = inSum - outSum
      tx['fee'] = fee < 0 ? 0 : fee // handle cellBase condition
      let flag = false
      tx['amount'] = 0;

      for (const input of tx.inputs) {
        if (input.address === address) {
          flag = true
          tx['income'] = false // 入账\收入

          for (const output of tx.outputs) {
            if (output.address !== address) {
              tx['amount'] = output.capacity
              break
            }
          }

          break
        }
      }

      if (!flag) {
        tx['income'] = true // 入账\收入

        for (const output of tx.outputs) {
          if (output.address === address) {
            tx['amount'] = output.capacity
            break
          }
        }
      }

    }

    return txs
  }
}
