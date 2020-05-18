import { Controller, Get, Post, Body, Param, UseInterceptors } from '@nestjs/common';
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

  @Post('getTxHistories')
  async getTxHistories(@Body() params: any): Promise<any> {
    const { args } = params.script // TODO params not null

    const txs = await this.cellService.getTxHistories(params)

    for (const tx of txs) {
      // Object.values(tx.inputs).map(item => item.capacity);
      // Object.values(tx.outputs).map(item => item.capacity);
      const inSum = tx.inputs.reduce((prev, next) => prev + next.capacity, 0)
      const outSum = tx.outputs.reduce((prev, next) => prev + next.capacity, 0)
      const fee = inSum - outSum
      tx['fee'] = fee < 0 ? 0 : fee // handle cellBase condition

      let flag = false
      tx['amount'] = 0

      for (const input of tx.inputs) {
        if (input.pubkeyHash === args) {
          flag = true
          tx['income'] = false // 入账\收入
          for (const output of tx.outputs) {
            if (output.pubkeyHash !== args) {
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
          if (output.pubkeyHash === args) {
            tx['amount'] = output.capacity
            break
          }
        }
      }
    }
    return txs
  }

  @Post('getLiveCells')
  async getLiveCells(@Body() params: any): Promise<any> {
    const liveCells = await this.cellService.getLiveCells(params)
    return liveCells
  }

  @Get('getUnspentCells/:lockArgs')
  async getUnspentCells(@Param('lockArgs') lockArgs: string){
    const unspentCells = await this.cellService.getUnspentCells(lockArgs)
    return unspentCells
  }

}
