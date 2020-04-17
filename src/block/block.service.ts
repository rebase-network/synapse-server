import { Injectable } from '@nestjs/common';
import { Interval, NestSchedule } from 'nest-schedule';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Block } from '../model/block.entity';


@Injectable()
export class BlockService extends NestSchedule {
  constructor(@InjectRepository(Block) private readonly repo: Repository<Block>) {
    super();
  }

  @Interval(5000)
  sync() {
    console.log(new Date(Date.now()))
    // return ['block']
  }
}
