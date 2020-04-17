import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from 'nest-schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configService } from './config/config.service';
import { CellModule } from './cell/cell.module';
import { BlockModule } from './block/block.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    ScheduleModule.register(),
    CellModule,
    BlockModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
