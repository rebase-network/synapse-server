import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configService } from './config/config.service';
import { CellModule } from './cell/cell.module';
import { BlockModule } from './block/block.module';

@Module({
  imports: [
    CellModule,
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    BlockModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
