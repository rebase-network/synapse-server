import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CellsController } from './cells/cells.controller';

@Module({
  imports: [],
  controllers: [AppController, CellsController],
  providers: [AppService],
})
export class AppModule {}
