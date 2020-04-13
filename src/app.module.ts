import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CellsModule } from './cells/cells.module';

@Module({
  imports: [CellsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
