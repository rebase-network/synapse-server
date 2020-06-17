import { Controller, Get, Post, Body, Param, Query, UseInterceptors } from '@nestjs/common';
import { CellService } from './cell.service';
import { LoggingInterceptor } from '../logging.interceptor';
import * as _ from 'lodash';

@Controller('cell')
@UseInterceptors(LoggingInterceptor)
export class CellController {
  constructor(private readonly cellService: CellService) { }

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
        if (input.lockArgs === args) {
          flag = true
          tx['income'] = false // 入账\收入
          for (const output of tx.outputs) {
            if (output.lockArgs !== args) {
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
          if (output.lockArgs === args) {
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

  @Get('getUnspentCells/:lockHash')
  async getUnspentCells(@Param('lockHash') lockHash: string, @Query() params) {
    // getUnspentCells/123456?isEmpty=true&capacity=100

    const _isEmpty = params.isEmpty?.toLowerCase()
    const isEmpty = _isEmpty == 'true' ? true : false

    let capacity = 0
    if(_.isEmpty( params.capacity)){
      capacity = 62
    }else{
      capacity = parseInt(params.capacity)
    }

    return await this.cellService.getUnspentCells(lockHash, isEmpty, capacity)
  }

}
