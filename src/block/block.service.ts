/// <reference types="@nervosnetwork/ckb-types" />
import * as _ from 'lodash';
import { bech32Address } from '@nervosnetwork/ckb-sdk-utils';
import { Injectable } from '@nestjs/common';
import { Interval, NestSchedule } from 'nest-schedule';
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
  capacity: bigint;
  address: string;
}
type TAddressesCapacity = {
  string?: number;
}

type TTx = {
  hash: string;
  blockNum: number;
  timestamp: number;
  outputs: [ReadableCell];
  inputs: [ReadableCell];
  fee: number;
  income: boolean;
  amount: number;
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


  async parseBlockTxs(txs): Promise<TTx[]> {
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
        newTx['blockNum'] = parseInt(tx.block_number, 16)
        const header = await this.ckb.rpc.getHeaderByNumber(tx.block_number)
        console.log('===> header: ', header, tx)
        if (header) {
          newTx['timestamp'] = parseInt(header.timestamp, 16)
        }
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
      await this.updateTip(tipNum);
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

    this.createBlock(block, block.transactions.length)

    const readableTxs: TTx[] = await this.parseBlockTxs(block.transactions);
    console.log(`=================== Start block ${height} ======================`);

    block.transactions.forEach(async tx => {
      tx.inputs.forEach(async (input: CKBComponents.CellInput) => {
        await this.killCell(input);
      })
      tx.outputs.forEach(async (output: CKBComponents.CellOutput, index: number) => {
        await this.createCell(output, index, tx);
      })
    })

    await this.updateAddressCapacity(readableTxs);
    console.log(`****************** End block ${height} ****************** `);
  }

  async getAddress(address: string): Promise<Address> {
    return await this.addressRepo.findOne({ address: address });
  }

  accuOutput = (previous: TAddressesCapacity | any, cell: ReadableCell) => {
    const previousCapacity = _.get(previous, cell.address, BigInt(0));

    const result = Object.assign(previous, {
      [cell.address]: BigInt(previousCapacity) + BigInt(cell.capacity)
    })

    return result;
  }

  accuInput = (previous: TAddressesCapacity, cell: ReadableCell) => {
    const previousCapacity = _.get(previous, cell.address, BigInt(0));
    const result = Object.assign(previous, {
      [cell.address]: BigInt(previousCapacity) - BigInt(cell.capacity)
    })

    return result;
  }

  getAddressesForUpdate = (txs: TTx[]) => {
    const addressesCapacity: TAddressesCapacity = {}

    txs.forEach((tx: TTx) => {
      tx.outputs.reduce(this.accuOutput, addressesCapacity)
      tx.inputs.reduce(this.accuInput, addressesCapacity)
    });

    return addressesCapacity;
  }

  async updateAddressCapacity(txs: TTx[]) {
    const addressesForUpdate: TAddressesCapacity = this.getAddressesForUpdate(txs);

    const addressesUpdater = Object.keys(addressesForUpdate).map(async address => {
      const oldAddr: Address = await this.getAddress(address);
      const oldCapacity = oldAddr ? BigInt(oldAddr.capacity) : BigInt(0);
      const newCapacity = oldCapacity + addressesForUpdate[address];
      if (oldAddr) {
        await this.addressRepo.update({ id: oldAddr.id }, { capacity: newCapacity });
        return;
      }
      const newAddr = new Address()
      newAddr.address = address;
      newAddr.capacity = newCapacity;
      await this.addressRepo.save(newAddr);
    });

    await Promise.all(addressesUpdater);
  }

  async killCell(input: CKBComponents.CellInput) {
    const oldCellObj = {
      isLive: true,
      txHash: input.previousOutput.txHash,
      index: input.previousOutput.index
    }
    const oldCell: Cell = await this.cellRepo.findOne(oldCellObj);
    if(oldCell && oldCell.isLive) {
      Object.assign(oldCell, {
        isLive: false,
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

    const savedBlock = await this.blockRepo.findOne(blockObj)
    if (savedBlock) return;
    const newBlock: Block = new Block();
    Object.assign(newBlock, blockObj);
    await this.blockRepo.save(newBlock);
  }

  async createCell(output, index, tx) {
    const cellObj = {
      isLive: true,
      capacity: bigintStrToNum(output.capacity),
      address: bech32Address(output.lock.args),
      txHash: tx.hash,
      index: `0x${index.toString(16)}`
    }
    const savedCell = await this.cellRepo.findOne(cellObj)
    if (savedCell) return;
    const newCell: Cell = new Cell();
    Object.assign(newCell, cellObj);

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
