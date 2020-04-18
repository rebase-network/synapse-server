import { Injectable } from '@nestjs/common';
import { Interval, NestSchedule } from 'nest-schedule';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Block } from '../model/block.entity';
import { CkbService } from '../ckb/ckb.service';
import { SyncStat } from '../model/syncstat.entity';

@Injectable()
export class BlockService extends NestSchedule {
  constructor(
    @InjectRepository(Block) private readonly blockRepo: Repository<Block>,
    @InjectRepository(SyncStat) private readonly syncStatRepo: Repository<SyncStat>,
    private readonly ckbService: CkbService
  ) {
    super();
  }

  private readonly ckb = this.ckbService.getCKB();

  /**
   * sync blocks from blockchain
   */
  @Interval(5000)
  async sync() {
    const header = await this.ckb.rpc.getTipHeader();
    console.log(new Date(Date.now()), 'header: ', header)
    const currentTip = parseInt(header.number, 16);
    await this.updateTip(currentTip);
  }

  /**
   * update last syncing block
   * @param tip block number
   */
  async updateTip(tip: number): Promise<any> {
    let block = await this.syncStatRepo.findOne();
    console.log('block: ', block)
    if (block) {
      block.tip = tip;
    } else {
      block = this.syncStatRepo.create({ tip })
    }
    this.syncStatRepo.save(block)
    return { block };
  }
}
