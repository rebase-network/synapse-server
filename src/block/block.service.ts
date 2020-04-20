/// <reference types="@nervosnetwork/ckb-types" />
import { AddressType, bech32Address, AddressPrefix, } from '@nervosnetwork/ckb-sdk-utils';
import { Injectable } from '@nestjs/common';
import { Interval, NestSchedule } from 'nest-schedule';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Block } from '../model/block.entity';
import { SyncStat } from '../model/syncstat.entity';
import { Cell } from '../model/cell.entity';
import { CkbService } from '../ckb/ckb.service';
import { EMPTY_HASH } from '../util/constant';
import { bigintStrToNum } from '../util/number'

@Injectable()
export class BlockService extends NestSchedule {
  constructor(
    @InjectRepository(Block) private readonly blockRepo: Repository<Block>,
    @InjectRepository(SyncStat) private readonly syncStatRepo: Repository<SyncStat>,
    @InjectRepository(Cell) private readonly cellRepo: Repository<Cell>,
    private readonly ckbService: CkbService
  ) {
    super();
  }

  private readonly ckb = this.ckbService.getCKB();
  private isSyncing = false;

  /**
   * sync blocks from blockchain
   */
  @Interval(5000)
  async sync() {
    const header = await this.ckb.rpc.getTipHeader();
    console.log(new Date(Date.now()), 'header: ', header)
    const tipNum = parseInt(header.number, 16);

    // get current synced height from db: syncedBlockNum
    const syncStat = await this.syncStatRepo.findOne();
    const syncedBlockNum = syncStat ? syncStat.tip : 0;

    // compare and save cells into db
    const cells = await this.getCellFromBlock(124145)
    for (let i = syncedBlockNum; i <= tipNum; i++) {
      // await this.cellRepo.save(cells)
    }
    await this.updateTip(tipNum);
    // syncing flag true
    this.isSyncing = true;
  }


  /**
   * fetch the specified block from CKB chain, extract data and then update database
   * @param height block number
   */
  async getCellFromBlock(height: number) {
    const block = await this.ckb.rpc.getBlockByNumber(
      '0x' + height.toString(16),
    );

    console.log('block: ', block);
    console.log('block: ', block.transactions.map(item => JSON.stringify(item)));
    // Cell: {
    //   id: number;
    //   isLive: boolean;
    //   capacity: bigint;
    //   address: string;
    //   txHash: string;
    // }
    const cellsInput = []
    const cellsOutput = []
    block.transactions.forEach(tx => {
      tx.inputs.forEach(async input => {
        // kill cell
        // txHash, index
        const oldCell = await this.cellRepo.findOne({
          isLive: true,
          txHash: input.previousOutput.txHash,
          index: input.previousOutput.index
        });
        if(oldCell) {
          Object.assign(oldCell, {
            isLive: false,
          });
          await this.cellRepo.save(oldCell);
        }
      })
      tx.outputs.forEach(async (output, index) => {
        // born cell
        const newCell: Cell = new Cell();
        Object.assign(newCell, {
          isLive: true,
          capacity: bigintStrToNum(output.capacity),
          address: bech32Address(output.lock.args),
          txHash: tx.hash,
          index: index.toString(16)
        });
        console.log('newCell: ', newCell)
        // await this.cellRepo.save(newCell);
      })
    })

    return [

    ]
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

  /**
   * get the last syncing block info
   */
  async getLastestBlock(): Promise<SyncStat> {
    return await this.syncStatRepo.findOne();
  }

  /**
   * get the latest block header on CKB chain
   */
  async getTipBlockHeader(): Promise<CKBComponents.BlockHeader> {
    return await this.ckb.rpc.getTipHeader();
  }

  /**
   * get block info with block height
   * @param height block number
   *
   * @returns block info
   */
  async getBlockByNumber(height: number): Promise<CKBComponents.Block> {
    const hexHeight = '0x' + height.toString(16);
    return await this.ckb.rpc.getBlockByNumber(hexHeight);
  }

  /**
   * get the best transaction fee rate currently.
   */
  async getFeeRate(): Promise<CKBComponents.FeeRate> {
    let feeRate: CKBComponents.FeeRate = { feeRate: '1000' };
    try {
      feeRate = await this.ckb.rpc.estimateFeeRate('0x3');
    } catch (err) {
      // this.logger.error('estimateFeeRate error', err, BlockService.name);
      console.error('estimateFeeRate error', err, BlockService.name);
    }
    return feeRate;
  }
}
