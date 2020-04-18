import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockController } from './block.controller';
import { BlockService } from './block.service';
import { Block } from '../model/block.entity';
import { SyncStat } from '../model/syncstat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Block, SyncStat])],
  controllers: [BlockController],
  providers: [BlockService]
})
export class BlockModule {}
