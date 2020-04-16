import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CellService } from './cell.service';
import { CellController } from './cell.controller';
import { Cell } from '../model/cell.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cell])],
  providers: [CellService],
  controllers: [CellController],
  exports: []
})
export class CellModule { }