import { Injectable } from '@nestjs/common';
import { Interval, NestSchedule } from 'nest-schedule';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Block } from '../model/block.entity';
import { CkbService } from '../ckb/ckb.service';


@Injectable()
export class BlockService extends NestSchedule {
  constructor(
    @InjectRepository(Block) private readonly repo: Repository<Block>,
    private readonly ckbService: CkbService,
  ) {
    super();
  }

  private readonly ckb = this.ckbService.getCKB();

  @Interval(5000)
  async sync() {
    const header = await this.ckb.rpc.getTipHeader();
    console.log(new Date(Date.now()), 'header: ', header)
  }
}
