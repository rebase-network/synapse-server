/// <reference types="@nervosnetwork/ckb-types" />
import { Injectable, HttpService } from '@nestjs/common';
import { map, isEmpty } from 'rxjs/operators';
import * as _ from 'lodash';
import * as Types from '../types';
import { configService } from '../config/config.service';
import { BlockService } from '../block/block.service';
import { AddressService } from '../address/address.service';
import { bigintStrToNum } from '../util/number';
import * as ckbUtils from '@nervosnetwork/ckb-sdk-utils';
import { CKB_TOKEN_DECIMALS, EMPTY_TX_HASH } from '../util/constant';
import { CellRepository } from './cell.repository';
import { ApiException } from '../exception/api.exception';
import { ApiCode } from '../util/apiCode.enums';
import * as utils from '@nervosnetwork/ckb-sdk-utils';
import { Not } from 'typeorm';
import { CkbService } from '../ckb/ckb.service';
import {
  ReadableCell,
  NewTx,
  TxHistory,
  BlockNumberAndTxHash,
} from './cell.interface';
import { Cell } from 'src/model/cell.entity';
import { ReturnCapacity } from './interfaces/cell.interface';

@Injectable()
export class CellService {
  constructor(
    private cellRepository: CellRepository,
    private readonly httpService: HttpService,
    private readonly blockService: BlockService,
    private readonly addressService: AddressService,
    private readonly ckbService: CkbService,
  ) {}

  private readonly ckb = this.ckbService.getCKB();

  public async create(cell: Cell): Promise<Cell> {
    return await this.cellRepository.save(cell);
  }

  public async getBalanceByAddress(address: string): Promise<number> {
    const queryObj = {
      address,
      status: 'live',
    };
    const liveCells = await this.cellRepository.find(queryObj);

    if (liveCells.length === 0) return 0;
    const result = liveCells.reduce((pre, cur, index, arr) => {
      return pre + Number(cur.capacity);
    }, 0);

    return result;
  }

  public getReturnCells(unspentCells) {
    const newUnspentCells = [];
    for (const cell of unspentCells) {
      const dataLength = ckbUtils.hexToBytes(cell.outputData).length;
      const newCell = {
        blockHash: cell.blockHash,
        lock: {
          codeHash: cell.lockCodeHash,
          hashType: cell.lockHashType,
          args: cell.lockArgs,
        },
        lockHash: cell.lockHash,
        outPoint: {
          txHash: cell.txHash,
          index: cell.index,
        },
        outputData: cell.outputData,
        outputDataLen: '0x' + dataLength.toString(16),
        capacity: '0x' + bigintStrToNum(cell.capacity.toString()).toString(16),
        type: {
          codeHash: cell.typeCodeHash,
          hashType: cell.typeHashType,
          args: cell.typeArgs,
        },
        typeHash: cell.typeHash,
        dataHash: cell.outputDataHash,
        status: cell.status,
      };
      newUnspentCells.push(newCell);
    }
    return newUnspentCells;
  }

  public async getUnspentCells(params: Types.UnspentCellsParams) {
    console.time('getUnspentCells');
    const { lockHash, typeHash, capacity, hasData, limit } = params;
    const queryObj: Types.UnspentCellsQuery = {
      lockHash,
      status: 'live',
    };
    if (!_.isEmpty(typeHash)) {
      queryObj.typeHash = typeHash;
    }

    if (hasData === 'true') {
      queryObj.outputData = Not('0x'); // TODO
    } else if (hasData === 'false') {
      queryObj.outputData = '0x';
    }

    // 1 - limit
    if (limit !== undefined) {
      const cells = await this.cellRepository.queryByQueryObjAndStepPage(
        queryObj,
        parseInt(limit, 10),
        0,
      );
      const unspentCells = await cells.getMany();
      return this.getReturnCells(unspentCells) || [];
    }

    // 2- capacity
    if (capacity === undefined) {
      return [];
    }

    const fakeFee = 1 * CKB_TOKEN_DECIMALS;
    const ckbcapacity = parseInt(capacity);
    const _totalcapacity = await this.addressService.getAddressInfo(lockHash);
    const totalcapacity = BigInt(_totalcapacity.capacity);

    if (totalcapacity < ckbcapacity) {
      // 余额不足
      //   throw new ServiceError('lack of capacity', '1001')
      throw new ApiException('lack of capacity', ApiCode.LACK_OF_CAPACITY, 200);
    }

    const sendCapactity = ckbcapacity + 61 * CKB_TOKEN_DECIMALS + fakeFee;

    const cell = await this.cellRepository.queryByQueryObjAndCapacity(
      queryObj,
      sendCapactity,
    );

    let unspentCells = [];
    if (cell) {
      unspentCells.push(cell);
    } else {
      let sumCapacity = 0;
      let page = 0;
      const step = 50;

      let newcells = [];
      do {
        const cells = await this.cellRepository.queryByQueryObjAndStepPage(
          queryObj,
          step,
          page,
        );
        newcells = await cells.getMany();
        unspentCells = _.concat(unspentCells, newcells);

        sumCapacity = unspentCells.reduce((pre, cur) => {
          return pre + BigInt(cur.capacity);
        }, BigInt(0));
        page += 1;
      } while (sumCapacity < sendCapactity && newcells.length > 0);
    }

    if (unspentCells.length === 0) {
      return [];
    }
    console.timeEnd('getUnspentCells');

    return this.getReturnCells(unspentCells);
  }

  public async getCellsByLockHashAndTypeScripts(
    lockHash,
    typeScripts: CKBComponents.Script[],
  ) {
    const result = {};
    if (
      typeScripts === undefined ||
      _.isEmpty(typeScripts) ||
      typeScripts.length === 0
    ) {
      const findObj = { lockHash, status: 'live' };
      const cells = await this.cellRepository.find(findObj);
      if (_.isEmpty(cells)) {
        return [];
      }
      const udts = [];
      for (const cell of cells) {
        if (cell.outputData !== '0x') {
          if (cell.typeCodeHash === undefined || cell.typeCodeHash === null) {
            const udt = {
              typeHash: null,
              capacity: cell.capacity,
              outputdata: cell.outputData,
              type: null,
            };
            udts.push(udt);
          } else {
            const typeScript: CKBComponents.Script = {
              args: cell.typeArgs,
              codeHash: cell.typeCodeHash,
              hashType: cell.typeHashType as CKBComponents.ScriptHashType,
            };
            const typeScriptHash = utils.scriptToHash(typeScript);
            const udt = {
              typeHash: typeScriptHash,
              capacity: cell.capacity,
              outputdata: cell.outputData,
              type: typeScript,
            };
            udts.push(udt);
          }
        }
      }
      result['udts'] = udts;
    } else {
      for (const typeScript of typeScripts) {
        const cells = await this.cellRepository.queryCellsByLockHashAndTypeScript(
          lockHash,
          typeScript.hashType,
          typeScript.codeHash,
          typeScript.args,
        );
        if (_.isEmpty(cells)) {
          return [];
        }
        const udts = [];
        for (const cell of cells) {
          const typeScript: CKBComponents.Script = {
            args: cell.typeArgs,
            codeHash: cell.typeCodeHash,
            hashType: cell.typeHashType as CKBComponents.ScriptHashType,
          };
          const typeScriptHash = utils.scriptToHash(typeScript);
          const udt = {
            typeHash: typeScriptHash,
            capacity: cell.capacity,
            outputdata: cell.outputData,
            type: typeScript,
            txHash: cell.txHash,
            index: cell.index,
          };
          udts.push(udt);
        }
        result['udts'] = udts;
      }
    }
    const freeCells = await this.cellRepository.queryFreeCellsByLockHash(
      lockHash,
    );
    function getTotalCapity(total, cell) {
      return BigInt(total) + BigInt(cell.capacity);
    }
    const totalFreeCapity = freeCells.reduce(getTotalCapity, 0);
    result['capacity'] = totalFreeCapity.toString();
    return result;
  }

  public async getCellsByLockHashAndTypeHashes(lockHash, typeHashes: string[]) {
    const result = {};
    if (typeHashes === undefined || typeHashes.length === 0) {
      const findObj = { lockHash, status: 'live' };
      const cells = await this.cellRepository.find(findObj);
      if (_.isEmpty(cells)) {
        return [];
      }
      const udts = [];
      for (const cell of cells) {
        if (cell.outputData !== '0x') {
          if (cell.typeCodeHash === undefined || cell.typeCodeHash === null) {
            const udt = {
              typeHash: null,
              capacity: cell.capacity,
              outputdata: cell.outputData,
              type: null,
            };
            udts.push(udt);
          } else {
            const typeScript: CKBComponents.Script = {
              args: cell.typeArgs,
              codeHash: cell.typeCodeHash,
              hashType: cell.typeHashType as CKBComponents.ScriptHashType,
            };
            const typeScriptHash = utils.scriptToHash(typeScript);
            const udt = {
              typeHash: typeScriptHash,
              capacity: cell.capacity,
              outputdata: cell.outputData,
              type: typeScript,
              txHash: cell.txHash,
              index: cell.index,
            };
            udts.push(udt);
          }
        }
      }
      result['udts'] = udts;
    } else {
      const cells = await this.cellRepository.queryCellsByLockHashAndTypeHashes(
        lockHash,
        typeHashes,
      );
      if (_.isEmpty(cells)) {
        return [];
      }
      const udts = [];
      for (const cell of cells) {
        const typeScript: CKBComponents.Script = {
          args: cell.typeArgs,
          codeHash: cell.typeCodeHash,
          hashType: cell.typeHashType as CKBComponents.ScriptHashType,
        };
        const typeScriptHash = utils.scriptToHash(typeScript);
        const udt = {
          typeHash: typeScriptHash,
          capacity: cell.capacity,
          outputdata: cell.outputData,
          type: typeScript,
        };
        udts.push(udt);
      }
      result['udts'] = udts;
    }
    const freeCells = await this.cellRepository.queryFreeCellsByLockHash(
      lockHash,
    );
    function getTotalCapity(total, cell) {
      return BigInt(total) + BigInt(cell.capacity);
    }
    const totalFreeCapity = freeCells.reduce(getTotalCapity, 0);
    result['capacity'] = totalFreeCapity.toString();
    return result;
  }

  public async getCapacity(lockHash): Promise<ReturnCapacity> {
    const capacity = await this.addressService.getAddressInfo(lockHash);

    const findObj = { lockHash, status: 'live', outputData: '0x' };
    const totalCapacity = await this.cellRepository.queryEmptyCapacity(findObj);
    const returnCapacity = {
      capacity: capacity.capacity,
      emptyCapacity: totalCapacity.totalCapacity,
    };
    return returnCapacity;
  }

  async parseBlockTxs(txs: TxHistory[]) {
    const newTxs = [];
    for (const tx of txs) {
      const newTx: Partial<NewTx> = {};
      newTx.hash = tx.txHash;
      if (tx.blockNumber) {
        newTx.blockNum = Number(tx.blockNumber);
        const header = await this.ckb.rpc.getHeaderByNumber(
          BigInt(tx.blockNumber),
        );
        if (!header) continue;
        newTx.timestamp = parseInt(header.timestamp, 16);
      }

      const txObj = await this.ckb.rpc.getTransaction(tx.txHash);
      const { outputs, inputs, outputsData } = txObj.transaction;
      const newInputs = [];
      for (const input of inputs) {
        const befTxHash = input.previousOutput.txHash;
        if (befTxHash !== EMPTY_TX_HASH) {
          // 0x000......00000 是出块奖励，inputs为空，cellbase
          const befIndex = input.previousOutput.index;
          const inputTxObj = await this.ckb.rpc.getTransaction(befTxHash);
          const inputTx = inputTxObj.transaction;
          const output = inputTx.outputs[parseInt(befIndex, 16)];
          const outputData = inputTx.outputsData[parseInt(befIndex, 16)];
          const newInput = this.getReadableCell(output, outputData);
          newInputs.push(newInput);
        }
      }

      newTx.inputs = newInputs;
      const newOutputs = [];
      for (const output of outputs) {
        let index = 0;
        const outputData = outputsData[parseInt(index.toString(), 16)];
        const newOutput = this.getReadableCell(output, outputData);
        newOutputs.push(newOutput);
        index++;
      }

      newTx.outputs = newOutputs;
      newTxs.push(newTx);
    }
    return newTxs;
  }

  async getTxDetails(blockTxs, lockHash) {
    for (const tx of blockTxs) {
      // Object.values(tx.inputs).map(item => item.capacity);
      // Object.values(tx.outputs).map(item => item.capacity);
      const inSum = tx.inputs.reduce((prev, next) => prev + next.capacity, 0);
      const outSum = tx.outputs.reduce((prev, next) => prev + next.capacity, 0);
      const fee = inSum - outSum;
      tx.fee = fee < 0 ? 0 : fee; // handle cellBase condition

      const flag = false;
      tx.amount = 0;

      // inputs outputs filter
      const inputCells = _.filter(tx.inputs, function(input) {
        return input.lockHash === lockHash;
      });
      console.log(/inputCells/, inputCells);
      const outputCells = _.filter(tx.outputs, function(output) {
        return output.lockHash === lockHash;
      });
      console.log(/outputCells/, outputCells);
      // 1-
      if (!_.isEmpty(inputCells) && _.isEmpty(outputCells)) {
        tx.income = false; // 出账
        tx.amount = inputCells.reduce((prev, next) => prev + next.capacity, 0);
        tx.sudt = inputCells.reduce((prev, next) => prev + next.sudt, 0);
      }
      // 2-
      if (_.isEmpty(inputCells) && !_.isEmpty(outputCells)) {
        tx.income = true; // 入账
        tx.amount = outputCells.reduce((prev, next) => prev + next.capacity, 0);
        tx.sudt = outputCells.reduce((prev, next) => prev + next.sudt, 0);
      }
      let inputAmount = 0;
      let outputAmount = 0;
      let inputSudt = 0;
      let outputSudt = 0;
      // 3-
      if (!_.isEmpty(inputCells) && !_.isEmpty(outputCells)) {
        inputAmount = inputCells.reduce(
          (prev, next) => prev + next.capacity,
          0,
        );
        outputAmount = outputCells.reduce(
          (prev, next) => prev + next.capacity,
          0,
        );
        if (inputAmount > outputAmount) {
          tx.income = false; // 出账
          tx.amount = inputAmount - outputAmount;
        } else {
          tx.income = true; // 入账
          tx.amount = outputAmount - inputAmount;
        }
        inputSudt = inputCells.reduce((prev, next) => prev + next.sudt, 0);
        outputSudt = outputCells.reduce((prev, next) => prev + next.sudt, 0);
        if (inputSudt > outputSudt) {
          tx.sudt = inputSudt - outputSudt;
        } else {
          tx.sudt = outputSudt - inputSudt;
        }
      }
    }
    return blockTxs;
  }

  parseSUDT = (bigEndianHexStr: string) => {
    const littleEndianStr = bigEndianHexStr
      .replace('0x', '')
      .match(/../g)
      .reverse()
      .join('');
    const first128Bit = littleEndianStr.substr(16);
    return parseInt(`0x${first128Bit}`, 16);
  };

  getReadableCell(output, outputData) {
    let typeHash = null;
    let sudt = 0;
    if (output.type !== null) {
      typeHash = ckbUtils.scriptToHash(output.type);
      sudt = this.parseSUDT(outputData);
    }

    const result: ReadableCell = {
      capacity: parseInt(output.capacity, 16),
      lockHash: ckbUtils.scriptToHash(output.lock),
      lockCodeHash: output.lock.codeHash,
      lockArgs: output.lock.args,
      lockHashType: output.lock.hashType,
      typeHash: typeHash,
      sudt: sudt,
    };
    return result;
  }

  async getTransactionsByLockHash(
    lockHash: string,
    page = 0,
    step = 20,
  ): Promise<BlockNumberAndTxHash[]> {
    const cells: Cell[] = await this.cellRepository.queryCellsByLockHashPage(
      lockHash,
      page,
      step,
    );
    let transactionList: BlockNumberAndTxHash[] = [];
    for (const cell of cells) {
      const transaction: BlockNumberAndTxHash = {
        blockNumber: cell.blockNumber.toString(),
        txHash: cell.txHash,
      };
      transactionList.push(transaction);
      transactionList = _.uniqBy(transactionList, 'txHash');
    }
    return transactionList;
  }

  public async getTxHistoriesByLockHash(lockHash, page = 0, step = 20) {
    const transactionList = await this.getTransactionsByLockHash(
      lockHash,
      page,
      step,
    );
    const blockTxs = await this.parseBlockTxs(transactionList);
    const result = await this.getTxDetails(blockTxs, lockHash);
    return result;
  }
}
