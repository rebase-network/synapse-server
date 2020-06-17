import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CellService } from './cell.service';
import { BlockModule } from '../block/block.module';
import { AddressModule } from '../address/address.module';
import { CellController } from './cell.controller';
import { Cell } from '../model/cell.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cell]), HttpModule, BlockModule, AddressModule],
  providers: [CellService],
  controllers: [CellController],
  exports: []
})
export class CellModule { }