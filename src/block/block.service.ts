/// <reference types="@nervosnetwork/ckb-types" />
import { bech32Address } from '@nervosnetwork/ckb-sdk-utils';
import { Injectable } from '@nestjs/common';
import { Interval, NestSchedule, Timeout } from 'nest-schedule';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as ckbUtils from '@nervosnetwork/ckb-sdk-utils';
import { Block } from '../model/block.entity';
import { SyncStat } from '../model/syncstat.entity';
import { Cell } from '../model/cell.entity';
import { Address } from '../model/address.entity';
import { CkbService } from '../ckb/ckb.service';
import { bigintStrToNum } from '../util/number';
import { EMPTY_TX_HASH } from '../util/constant';

type ReadableCell = {
  "capacity": bigint;
  "address": string;
}
type AddressesBalance = {
  string?: number;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

@Injectable()
export class BlockService extends NestSchedule {
  constructor(
    @InjectRepository(Block) private readonly blockRepo: Repository<Block>,
    @InjectRepository(SyncStat) private readonly syncStatRepo: Repository<SyncStat>,
    @InjectRepository(Cell) private readonly cellRepo: Repository<Cell>,
    @InjectRepository(Address) private readonly addressRepo: Repository<Address>,
    private readonly ckbService: CkbService
  ) {
    super();
  }

  private readonly ckb = this.ckbService.getCKB();
  private isSyncing = false;


  async parseBlockTxs(txs) {
    const opts: ckbUtils.AddressOptions = {
      prefix: ckbUtils.AddressPrefix.Testnet,
      type: ckbUtils.AddressType.HashIdx,
      codeHashOrCodeHashIndex: '0x00',
    }

    const newTxs = []
    for (const tx of txs) {
      const newTx = {}

      newTx['hash'] = tx.tx_hash
      if (tx.block_number) {
        newTx['block_num'] = parseInt(tx.block_number, 16)
        const header = await this.ckb.rpc.getHeaderByNumber(tx.block_number)
        newTx['timestamp'] = parseInt(header.timestamp, 16)
      }

      // const txObj = await this.cellService.getTxByTxHash(tx.tx_hash)
      const txObj = (await this.ckb.rpc.getTransaction(tx.hash || tx.tx_hash)).transaction

      const outputs = txObj.outputs
      const inputs = txObj.inputs

      console.log("outputs num: ", outputs.length);
      console.log("inputs num: ", inputs.length);

      const newInputs = []

      for (const input of inputs) {
        const newInput = {}
        const befTxHash = input.previousOutput.txHash

        // cellbase
        if (befTxHash !== EMPTY_TX_HASH) {

          // 0x000......00000 是出块奖励，inputs为空，cellbase
          const befIndex = input.previousOutput.index

          // const inputTxObj = await this.cellService.getTxByTxHash(befTxHash)
          const inputTxObj = (await this.ckb.rpc.getTransaction(befTxHash)).transaction
          const _output = inputTxObj.outputs[parseInt(befIndex, 16)]

          newInput['capacity'] = parseInt(_output.capacity, 16)
          newInput['address'] = ckbUtils.bech32Address(_output.lock.args, opts)

          newInputs.push(newInput)
        }
      }

      newTx['inputs'] = newInputs

      const newOutputs = []

      for (const output of outputs) {
        const newOutput = {}
        newOutput['capacity'] = parseInt(output.capacity, 16)
        newOutput['address'] = ckbUtils.bech32Address(output.lock.args, opts)
        newOutputs.push(newOutput)
      }

      newTx['outputs'] = newOutputs
      newTxs.push(newTx)
    }

    return newTxs
  }

  /**
   * sync blocks from blockchain
   */
  // @Interval(5000)
  @Timeout(2000)
  async sync() {
    // const header = await this.ckb.rpc.getTipHeader();
    const tipNumStr = await this.ckb.rpc.getTipBlockNumber();
    const tipNum = parseInt(tipNumStr, 16);
    // get current synced height from db: syncedBlockNum
    const syncStat = await this.syncStatRepo.findOne();
    const tipNumSynced = syncStat ? Number(syncStat.tip) : 0;

    // Already the newest, do not need to sync
    if (tipNumSynced >= tipNum || this.isSyncing) return;

    this.isSyncing = true;

    console.log(`${tipNum - tipNumSynced} blocks need to be synced: ${tipNumSynced+1} - ${tipNum}`)
    // for (let i = tipNumSynced+1; i <= tipNum; i++) {
    //   await this.updateBlockInfo(i)
    // }
    await this.updateBlockInfo(70)

    await this.updateTip(tipNum);
    // syncing flag true
    this.isSyncing = false;
  }

  /**
   * fetch the specified block from CKB chain, extract data and then update database
   * @param height block number
   */
  async updateBlockInfo(height: number) {
    // compare and save cells into db, from block[tipNumSynced] to block[tipNum]
    const block = await this.ckb.rpc.getBlockByNumber(
      '0x' + height.toString(16),
    );
    // 1. format block, formatted inputs and outputs
    const readableTxs = await this.parseBlockTxs(block.transactions)
    // 2. handleCell: killCell(isLive = false), createCell(isLive = true)
    block.transactions.forEach(async tx => {
      tx.inputs.forEach(async (input: CKBComponents.CellInput) => {
        // kill cell(update cell isLive flag)
        await this.killCell(input);
      })
      tx.outputs.forEach(async (output: CKBComponents.CellOutput, index: number) => {
        // new cell
        await this.createCell(output, index, tx);
      })
      // 3. handleAddress:
      // cell input => address.balance - cell.capacity;
      // cell output => create address(output.capacity); address.balance + cell.capacity
      // console.log('bbbbbbbbbbbb block: ', JSON.stringify(block));
      // console.log('rrrrrrrrrrrr readableTxs: ', JSON.stringify(readableTxs));
    })
    await this.updateAddressBalance(readableTxs);
  }
  async getAddress(address: string): Promise<Address> {
    return await this.addressRepo.findOne({ address: address });
  }
  accuOutput = async (pre, output: ReadableCell, index, arr) => {
    console.log(' ---------- ', pre, output, index, arr.toString())
    let addr = await this.getAddress(output.address);

    if (!addr) {
      console.log('will save address');
      addr = new Address()
      addr.address = output.address;
      addr.balance = output.capacity;
      await this.addressRepo.save(addr);
    } else {
      pre[output.address] = BigInt(addr.balance) + BigInt(output.capacity);
    }
    console.log(' +++++++++++++ ', pre, output, index, arr.toString())
    return pre;
  }
  async updateAddressBalance(txs) {
    console.log('updateAddressBalance 111111111 ', JSON.stringify(txs))
    // update address balance
    await txs.forEach(async (tx, index) => {
      console.log(index, tx, ' ******* ')
      let addressesBalance: AddressesBalance = await tx.outputs.reduce(this.accuOutput, {})

      // addressesBalance = await tx.inputs.reduce(async (pre, input: ReadableCell, index, arr) => {
      //   // console.log(' ============= txHash: ', input.previousOutput.txHash);
      //   // if (EMPTY_TX_HASH === input.previousOutput.txHash) return pre;
      //   const originalAddress = await this.getAddress(input.address)
      //   pre[input.address] = BigInt(originalAddress.balance) - BigInt(input.capacity);
      //   // console.log(' 1111111111 pre: ', pre);
      //   return pre;
      // }, addressesBalance)

      console.log(' 222222222222 addressesBalance: ', addressesBalance);


      // Object.keys(addressesBalance).forEach(async address => {
      //   // const addr: Address = await this.addressRepo.findOne({ address });
      //   // addr.balance = addressesBalance[address];
      //   await this.addressRepo.update({ address }, { balance: addressesBalance[address] });
      // });
    });
  }

  async killCell(input: CKBComponents.CellInput) {
    const oldCellObj = {
      isLive: true,
      txHash: input.previousOutput.txHash,
      index: input.previousOutput.index
    }
    const oldCell: Cell = await this.cellRepo.findOne(oldCellObj);
    if(oldCell) {
      Object.assign(oldCell, {
        isLive: false,
      });
      await this.cellRepo.save(oldCell);
    }
  }

  async createCell(output, index, tx) {
    const newCell: Cell = new Cell();
    Object.assign(newCell, {
      isLive: true,
      capacity: bigintStrToNum(output.capacity),
      address: bech32Address(output.lock.args),
      txHash: tx.hash,
      index: `0x${index.toString(16)}`
    });

    await this.cellRepo.save(newCell);
  }


  /**
   * update last syncing block
   * @param tip block number
   */
  async updateTip(tip: number): Promise<any> {
    let block = await this.syncStatRepo.findOne();
    if (block) {
      block.tip = tip;
    } else {
      block = this.syncStatRepo.create({ tip })
    }
    this.syncStatRepo.save(block)
    console.log('Height updated to: ', tip)
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
