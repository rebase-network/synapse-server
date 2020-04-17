import { Injectable } from '@nestjs/common';
import { Interval, NestSchedule } from 'nest-schedule';

@Injectable()
export class BlockService extends NestSchedule {
  @Interval(5000)
  sync() {
    console.log(new Date(Date.now()))
    // return ['block']
  }
}
