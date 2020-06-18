import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyncstatController } from './syncstat.controller';
import { SyncstatService } from './syncstat.service';
import { SyncstatRepository } from './syncstat.repository';
import { SyncStat } from '../model/syncstat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SyncStat,SyncstatRepository])],
  controllers: [SyncstatController],
  providers: [SyncstatService],
  exports: [SyncstatService],
})
export class SyncstatModule {}
