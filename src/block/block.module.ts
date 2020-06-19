import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockController } from './block.controller';
import { BlockService } from './block.service';
import { Block } from '../model/block.entity';
import { Cell } from '../model/cell.entity';
import { SyncStat } from '../model/syncstat.entity';
import { Address } from '../model/address.entity';
import { BlockRepository } from './block.repository';
import { CellRepository } from '../cell/cell.repository';
import { AddressRepository } from '../address/address.repository';
import { SyncstatRepository } from '../syncstat/syncstat.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SyncStat,
      SyncstatRepository,
      Block,
      BlockRepository,
      Cell,
      CellRepository,
      Address,
      AddressRepository,
    ]),
  ],
  controllers: [BlockController],
  providers: [BlockService],
  exports: [BlockService],
})
export class BlockModule {}
