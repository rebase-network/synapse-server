import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockController } from './block.controller';
import { BlockService } from './block.service';
import { Block } from '../model/block.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Block])],
  controllers: [BlockController],
  providers: [BlockService]
})
export class BlockModule {}
