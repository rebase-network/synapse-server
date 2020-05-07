import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockController } from './block.controller';
import { BlockService } from './block.service';
import { Block } from '../model/block.entity';
import { Cell } from '../model/cell.entity';
import { SyncStat } from '../model/syncstat.entity';
import { Address } from '../model/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Block, Cell, SyncStat, Address])],
  controllers: [BlockController],
  providers: [BlockService],
  exports: [BlockService],
})
export class BlockModule {}
