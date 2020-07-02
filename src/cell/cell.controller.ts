import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CellService } from './cell.service';
import { LoggingInterceptor } from '../logging.interceptor';
import * as _ from 'lodash';
import { IndexerService } from './cell.indexer';

@Controller('cell')
@UseInterceptors(LoggingInterceptor)
export class CellController {
  constructor(
      private readonly cellService: CellService,
      private readonly indexerService: IndexerService
    ) {}

  @Post('getTxHistories')
  async getTxHistories(@Body() params: any): Promise<any> {
    const { args } = params.script; // TODO params not null

    const txs = await this.cellService.getTxHistories(params);

    for (const tx of txs) {
      // Object.values(tx.inputs).map(item => item.capacity);
      // Object.values(tx.outputs).map(item => item.capacity);
      const inSum = tx.inputs.reduce((prev, next) => prev + next.capacity, 0);
      const outSum = tx.outputs.reduce((prev, next) => prev + next.capacity, 0);
      const fee = inSum - outSum;
      tx['fee'] = fee < 0 ? 0 : fee; // handle cellBase condition

      let flag = false;
      tx['amount'] = 0;

      for (const input of tx.inputs) {
        if (input.lockArgs === args) {
          flag = true;
          tx['income'] = false; // 入账\收入
          for (const output of tx.outputs) {
            if (output.lockArgs !== args) {
              tx['amount'] = output.capacity;
              break;
            }
          }
          break;
        }
      }
      if (!flag) {
        tx['income'] = true; // 入账\收入
        for (const output of tx.outputs) {
          if (output.lockArgs === args) {
            tx['amount'] = output.capacity;
            break;
          }
        }
      }
    }
    return txs;
  }

//   @Post('getLiveCells')
//   async getLiveCells(@Body() params: any): Promise<any> {
//     const liveCells = await this.cellService.getLiveCells(params);
//     return liveCells;
//   }

  @Get('getUnspentCells')
  async getUnspentCells(@Query() params) {
    const result = await this.cellService.getUnspentCells(params)
    return result;
  }

  @Post('getCellsByLockHashAndTypeScripts')
  async getCellsByLockHashAndTypeScripts(@Body() params: any): Promise<any> {
    const { lockHash, typeScripts } = params;
    return await this.cellService.getCellsByLockHashAndTypeScripts(
      lockHash,
      typeScripts,
    );
  }

  @Post('getTxHistoriesByIndexer')
  async getTxHistoriesByIndexer(@Body() params: any): Promise<any> {
    const result = this.indexerService.getTxHistories(params);
    return result;
  }
}
