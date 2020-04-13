import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CellsController } from './cells/cells.controller';
import { CellsService } from './cells/cells.service';

@Module({
  imports: [],
  controllers: [AppController, CellsController],
  providers: [AppService, CellsService],
})
export class AppModule {}
