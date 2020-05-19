/// <reference types="@nervosnetwork/ckb-types" />
import * as ckbUtils from '@nervosnetwork/ckb-sdk-utils';

import * as _ from 'lodash';
import { bech32Address } from '@nervosnetwork/ckb-sdk-utils';
import { Injectable } from '@nestjs/common';
import { Interval, NestSchedule } from 'nest-schedule';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as Types from '../types';
import { Block } from '../model/block.entity';
import { SyncStat } from '../model/syncstat.entity';
import { Cell } from '../model/cell.entity';
import { Address } from '../model/address.entity';
import { CkbService } from '../ckb/ckb.service';
import { bigintStrToNum } from '../util/number';
import { EMPTY_TX_HASH } from '../util/constant';

interface TAddressesCapacity {
  string?: number;
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

  getReadableCell(output) {
    const result = {};
    result['capacity'] = parseInt(output.capacity, 16)
    result['pubkeyHash'] = output.lock.args
    result['address'] = ckbUtils.bech32Address(output.lock.args)
    result['lockHash'] = ckbUtils.scriptToHash(output.lock);
    result['lockCodeHash'] = output.lock.codeHash;
    result['lockArgs'] = output.lock.args;
    result['lockHashType'] = output.lock.hashType;

    return result;
  }

  async parseBlockTxs(txs): Promise<Types.ReadableTx[]> {

    const newTxs = []
    for (const tx of txs) {
      const newTx = {}

      newTx['hash'] = tx.tx_hash
      if (tx.block_number) {
        newTx['blockNum'] = parseInt(tx.block_number, 16)
        const header = await this.ckb.rpc.getHeaderByNumber(tx.block_number)
        if (!header) continue;
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
        const befTxHash = input.previousOutput.txHash

        // cellbase
        if (befTxHash !== EMPTY_TX_HASH) {

          // 0x000......00000 是出块奖励，inputs为空，cellbase
          const befIndex = input.previousOutput.index

          // const inputTxObj = await this.cellService.getTxByTxHash(befTxHash)
          const inputTxObj = (await this.ckb.rpc.getTransaction(befTxHash)).transaction
          const output = inputTxObj.outputs[parseInt(befIndex, 16)]

          const newInput = this.getReadableCell(output)
          newInputs.push(newInput)
        }
      }

      newTx['inputs'] = newInputs

      const newOutputs = []

      for (const output of outputs) {
        const newOutput = this.getReadableCell(output)
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
  @Interval(5000)
  async sync() {
    const tipNumStr = await this.ckb.rpc.getTipBlockNumber();
    const tipNum = parseInt(tipNumStr, 16);
    const syncStat = await this.syncStatRepo.findOne();
    const tipNumSynced = syncStat ? Number(syncStat.tip) : 0;

    // Already the newest, do not need to sync
    if (tipNumSynced >= tipNum || this.isSyncing) return;

    this.isSyncing = true;

    console.log(`${tipNum - tipNumSynced} blocks need to be synced: ${tipNumSynced+1} - ${tipNum}`)
    for (let i = tipNumSynced+1; i <= tipNum; i++) {
      await this.updateBlockInfo(i)
    }

    this.isSyncing = false;
  }

  /**
   * fetch the specified block from CKB chain, extract data and then update database
   * @param height block number
   */
  async updateBlockInfo(height: number) {
    const block = await this.ckb.rpc.getBlockByNumber(
      '0x' + height.toString(16),
    );

    const savedBlock = await this.blockRepo.findOne({ number: height });
    if (savedBlock) return;

    await this.createBlock(block, block.transactions.length);

    await this.updateTip(height);

    const readableTxs: Types.ReadableTx[] = await this.parseBlockTxs(block.transactions);
    console.log(`=================== Start block ${height} ======================`);

    block.transactions.forEach(async (tx, inx) => {

      const outPoint: CKBComponents.OutPoint={
        txHash: tx.hash,
        index: `0x${inx.toString(16)}`
      }

      const liveCell = await this.ckb.rpc.getLiveCell(outPoint, true);

      tx.inputs.forEach(async (input: CKBComponents.CellInput) => {
        await this.killCell(input);
      })

      tx.outputs.forEach(async (output: CKBComponents.CellOutput, index: number) => {
        const outputData = tx.outputsData[index]
        await this.createCell(block.header, output, index, tx, outputData, liveCell);
      })
    })

    await this.updateAddressCapacity(readableTxs);

    console.log(`****************** End block ${height} ****************** `);
  }

  async getAddress(address: string): Promise<Address> {
    return await this.addressRepo.findOne({ address });
  }

  accuOutput = (previous: Types.LockhashCapacity | any, cell: Types.ReadableCell) => {
    const previousCapacity = _.get(previous[cell.address], 'capacity', BigInt(0));

    const result = Object.assign(previous, {
      [cell.address]: {
        capacity: BigInt(previousCapacity) + BigInt(cell.capacity),
        lockHash: cell.lockHash,
        lockScript: {
          args: cell.lockArgs,
          hashType: cell.lockHashType,
          codeHash: cell.lockCodeHash,
        }
      }
    })

    return result;
  }

  accuInput = (previous: Types.LockhashCapacity, cell: Types.ReadableCell) => {
    const previousCapacity = _.get(previous[cell.address], 'capacity', BigInt(0));
    const result = Object.assign(previous, {
      [cell.address]: {
        capacity: BigInt(previousCapacity) - BigInt(cell.capacity),
        lockHash: cell.lockHash,
        lockScript: {
          args: cell.lockArgs,
          hashType: cell.lockHashType,
          codeHash: cell.lockCodeHash,
        }
      }
    })

    return result;
  }

  getAddressesForUpdate = (txs: Types.ReadableTx[]) => {
    const addressesCapacity = {}

    txs.forEach((tx: Types.ReadableTx) => {
      tx.outputs.reduce(this.accuOutput, addressesCapacity)
      tx.inputs.reduce(this.accuInput, addressesCapacity)
    });

    return addressesCapacity;
  }

  async updateAddressCapacity(txs: Types.ReadableTx[]) {
    try {
      const addressesForUpdate = this.getAddressesForUpdate(txs);

      const addressesUpdater = Object.keys(addressesForUpdate).map(async address => {
      const oldAddr: Address = await this.getAddress(address);
      console.log('===> oldAddr: ', oldAddr)
      const oldCapacity = oldAddr ? BigInt(oldAddr.capacity) : BigInt(0);
      const newCapacity = oldCapacity + _.get(addressesForUpdate[address], 'capacity');

      if (oldAddr) {
        await this.addressRepo.update({ id: oldAddr.id }, { capacity: newCapacity });
        return;
      }

      const newAddr = new Address();
      const { lockScript, lockHash } = addressesForUpdate[address];
      newAddr.capacity = newCapacity;
      newAddr.lockHash = lockHash;
      newAddr.address = address; // todo delete me
      newAddr.lockArgs = lockScript.args;
      newAddr.lockCodeHash = lockScript.codeHash;
      newAddr.lockHashType = lockScript.hashType;
      console.log(' ----> newAddr: ', newAddr)
      await this.addressRepo.save(newAddr);
    });

    await Promise.all(addressesUpdater);

  } catch (error) {
    console.log('===> err is: ', error)
  }
}

  async killCell(input: CKBComponents.CellInput) {
    const oldCellObj = {
      status: 'live',
      txHash: input.previousOutput.txHash,
      index: input.previousOutput.index
    }
    const oldCell: Cell = await this.cellRepo.findOne(oldCellObj);
    if(oldCell && oldCell.status) {
      Object.assign(oldCell, {
        status: 'dead', // 查一下
      });
      await this.cellRepo.save(oldCell);
    }
  }

  async createBlock(block, txCount) {
    const header = block.header

    const blockObj = {
      number: parseInt(header.number, 16),
      hash: header.hash,
      // epochNumber: parseInt(header.epoch, 16),
      // epochIndex: parseInt(header.nonce, 16),
      // epochLength: 0,
      timestamp: parseInt(header.timestamp, 16),
      transactionCount: txCount,
      dao: header.dao
    }

    const newBlock: Block = new Block();
    Object.assign(newBlock, blockObj);
    await this.blockRepo.save(newBlock);
  }

  // TODO
  async createCell(header, output, index, tx, outputData, liveCell) {
    const findCellObj = {
      txHash: tx.hash,
      index: `0x${index.toString(16)}`,
      status: 'live',
      lockArgs: output.lock.args,
    }

    const existCell = await this.cellRepo.findOne(findCellObj)
    if (existCell) return;
    const newCell: Cell = new Cell();

    const newCellObj = {
      blockNumber: parseInt(header.number, 16),
      blockHash: header.hash,
      timestamp: parseInt(header.timestamp, 16),
      txHash: tx.hash,
      index: `0x${index.toString(16)}`,
      status: 'live',
      lockArgs: output.lock.args,
      lockCodeHash: output.lock.codeHash,
      lockHashType: output.lock.hashType,
      capacity: bigintStrToNum(output.capacity),
      address: bech32Address(output.lock.args),
      outputData: outputData,
      outputDataHash: _.get(liveCell, 'cell.data.hash', ''),
      outputDataLen: '',
    }

    Object.assign(newCell, newCellObj);

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
    await this.syncStatRepo.save(block)
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
