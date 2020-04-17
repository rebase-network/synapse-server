import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, Interval } from '@nestjs/schedule';

@Injectable()
export class BlockService {
  @Cron(CronExpression.EVERY_5_SECONDS, {
    name: 'block cron job',
  })
  sync(): string[] {
    console.log(new Date(Date.now()))
    return ['block']
  }

  @Interval(3000)
  handleInterval() {
    console.debug('Called every 3 seconds');
  }
}
