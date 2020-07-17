import { Controller, Get, Query, UseInterceptors, Param } from '@nestjs/common';
import { CellService } from './cell.service';
import { LoggingInterceptor } from '../logging.interceptor';
import * as _ from 'lodash';
import { UnSpentCellsDTO } from './dto/cell.unspentcells.dto';
import { ApiQuery } from '@nestjs/swagger';
import { UdtsDTO } from './dto/cell.udts.dto';

@Controller('locks')
@UseInterceptors(LoggingInterceptor)
export class CellController {
  constructor(private readonly cellService: CellService) {}

  @Get(':lockHash/cells/unspent')
  async getUnspentCells(
    @Param('lockHash') lockHash: string,
    @Query() unSpentCellsDTO: UnSpentCellsDTO,
  ) {
    const queryPrams = {
      lockHash: lockHash,
      typeHash: unSpentCellsDTO.typeHash,
      capacity: unSpentCellsDTO.capacity,
      hasData: unSpentCellsDTO.hasData,
      limit: unSpentCellsDTO.limit,
    };
    const result = await this.cellService.getUnspentCells(queryPrams);
    return result;
  }

  @Get(':lockHash/tokens')
  async getUDTsByLockHashAndTypeHashes(
    @Param('lockHash') lockHash: string,
    @Query() udtsDTO: UdtsDTO,
  ): Promise<any> {
    let typeHashes: string[] = [];
    if (udtsDTO.typeHashes !== undefined) {
      typeHashes = _.concat(typeHashes, udtsDTO.typeHashes);
    }
    return await this.cellService.getCellsByLockHashAndTypeHashes(
      lockHash,
      typeHashes,
    );
  }

  @Get(':lockHash/txs')
  async getTxHistoriesByLockHash(@Param('lockHash') lockHash: string,): Promise<any> {
    const result = this.cellService.getTxHistoriesByLockHash(lockHash);
    return result;
  }

  @ApiQuery({
    name: 'lockHash',
    description: 'lockHash',
  })
  @Get('getUnspentCapacity')
  async getUnspentCapacity(@Query('lockHash') lockHash: string) {
    const result = await this.cellService.getUnspentCapacity(lockHash);
    return result;
  }
}
