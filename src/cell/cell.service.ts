import { Injectable, HttpService } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as ckbUtils from '@nervosnetwork/ckb-sdk-utils';
import { Cell as CellEntity } from '../model/cell.entity';
import { Cell } from './interfaces/cell.interface';
import { configService } from '../config/config.service';

@Injectable()
export class CellService {
  constructor(
    @InjectRepository(CellEntity) private readonly repo: Repository<CellEntity>,
    private readonly httpService: HttpService
  ) { }

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
      newTx['block_num'] = parseInt(tx.block_number, 16)

      const header = await this.getHeaderByNum(tx.block_number)
      const txObj = await this.getTxByTxHash(tx.tx_hash)

      newTx['timestamp'] = parseInt(header.timestamp, 16)

      const outputs = txObj.outputs
      const inputs = txObj.inputs

      console.log("outputs num: ", outputs.length);
      console.log("inputs num: ", inputs.length);

      const newInputs = []

      for (const input of inputs) {
        const newInput = {}
        const befTxHash = input.previous_output.tx_hash

        // cellbase
        if (befTxHash !== "0x0000000000000000000000000000000000000000000000000000000000000000") {

          // 0x000......00000 是出块奖励，inputs为空，cellbase
          const befIndex = input.previous_output.index

          const inputTxObj = await this.getTxByTxHash(befTxHash)
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

  public getBalanceByPubkeyHash(pubkeyHash: string): Promise<number> {

    const payload = {
      "id": 0,
      "jsonrpc": "2.0",
      "method": "get_cells",
      "params": [{
        "script": {
          "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
          "hash_type": "type",
          "args": pubkeyHash
        },
        "script_type": "lock"
      },
        "desc",
        "0x200" // 512
      ]
    }

    const observable = this.httpService.post(configService.CKB_INDEXER_ENDPOINT, payload)

    return observable.pipe(map(resp => {
      const liveCells = resp.data.result.objects
      console.log("live cell num: ", liveCells.length);

      if (liveCells.length === 0) return 0;

      const result = liveCells.reduce((pre, cur, index, arr) => {
        return pre + Number(cur.output.capacity)
      }, 0)

      return result;

    })).toPromise();

  }

  public async getBalanceByAddress(address: string): Promise<number> {
    const queryObj = {
      address,
      isLive: true,
    }
    const liveCells = await this.repo.find(queryObj);

    if (liveCells.length === 0) return 0;

    const result = liveCells.reduce((pre, cur, index, arr) => {
      return pre + Number(cur.capacity)
    }, 0)

    return result;
  }

  public getTxsByPubkeyHash(pubkeyHash: string): Promise<any> {
    // https://explorer.nervos.org/aggron/transaction/0x42954c09bdf78338e480376ab2b08feeb56a10abd78fbe568beeae10a219361d
    // ckb-indexer 没有去重

    /*
      [{
          "block_number": "0x2b890",
          "io_index": "0x0",
          "io_type": "output",
          "tx_hash": "0x965ae599eb55fafb70816be039343e43ca25c492eb4cbdad260682492c5c8da0",
          "tx_index": "0x1"
        },
        {
          "block_number": "0x24e2f",
          "io_index": "0x0",
          "io_type": "output",
          "tx_hash": "0x3552713aa857b4536195d81b4555f86b6566e1416791a8cf60090daa76eeae52",
          "tx_index": "0x2f"
        }
      ]
     */

    const payload = {
      "id": 0,
      "jsonrpc": "2.0",
      "method": "get_transactions",
      "params": [{
        "script": {
          "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
          "hash_type": "type",
          "args": pubkeyHash
        },
        "script_type": "lock"
      },
        "desc", // 倒叙排列，最近的16条交易记录
        "0xf" // 16
      ]
    }

    const observable = this.httpService.post(configService.CKB_INDEXER_ENDPOINT, payload)

    return observable.pipe(map(resp => {
      const txs = resp.data.result.objects
      console.log("txs num: ", txs.length);

      if (txs.length === 0) return null;
      return this.parseBlockTxs(txs)

    })).toPromise();

  }


  public getTxByTxHash(txHash: string): Promise<any> {
    /*
      {
      "cell_deps": [{
          "dep_type": "code",
          "out_point": {
            "index": "0x3",
            "tx_hash": "0x96fea0dfaac1186fbb98fd452cb9b13976f9a00bcce130035fe2e30dac931d1d"
          }
        },
        {
          "dep_type": "code",
          "out_point": {
            "index": "0x1",
            "tx_hash": "0x96fea0dfaac1186fbb98fd452cb9b13976f9a00bcce130035fe2e30dac931d1d"
          }
        }
      ],
      "hash": "0x6495cede8d500e4309218ae50bbcadb8f722f24cc7572dd2274f5876cb603e4e",
      "header_deps": [],
      "inputs": [{
        "previous_output": {
          "index": "0x5",
          "tx_hash": "0x96fea0dfaac1186fbb98fd452cb9b13976f9a00bcce130035fe2e30dac931d1d"
        },
        "since": "0x0"
      }],
      "outputs": [{
          "capacity": "0x2b95fd500",
          "lock": {
            "args": "0x",
            "code_hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "hash_type": "data"
          },
          "type": null
        },
        {
          "capacity": "0x2b95fd500",
          "lock": {
            "args": "0x",
            "code_hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "hash_type": "data"
          },
          "type": null
        }
      ],
      "outputs_data": [
        "0x0200000096fea0dfaac1186fbb98fd452cb9b13976f9a00bcce130035fe2e30dac931d1d0300000096fea0dfaac1186fbb98fd452cb9b13976f9a00bcce130035fe2e30dac931d1d01000000",
        "0x0200000096fea0dfaac1186fbb98fd452cb9b13976f9a00bcce130035fe2e30dac931d1d0300000096fea0dfaac1186fbb98fd452cb9b13976f9a00bcce130035fe2e30dac931d1d04000000"
      ],
      "version": "0x0",
      "witnesses": [
        "0x573a09976845ac859ce818312a4af791499d7314af75685ef1e0959f06405e0e498832133ffb5d06fdafa840b1ab3cbba9cbf171e65b9546c8db1231f0089f2601"
      ]
    }
    */

    const payload = {
      "id": 0,
      "jsonrpc": "2.0",
      "method": "get_transaction",
      "params": [txHash]
    }

    const observable = this.httpService.post(configService.CKB_RPC_ENDPOINT, payload)

    return observable.pipe(map(resp => {
      const result = resp.data.result

      if (result == null) return null
      const tx = result.transaction
      return tx;

    })).toPromise();

  }

  public getHeaderByNum(hexNum: string): Promise<any> {
    /*
      {
        "compact_target": "0x1c550be8",
        "dao": "0x5a38369bc7f1722f4091378072ad2300002d9c30c8472b00006d6130dcb20607",
        "epoch": "0x24e00b20000e9",
        "hash": "0x5c97d9d7472c67116670ef2aeb2adf0eafffcfdfb40fc28c46efe3e215b8b2f7",
        "nonce": "0xcee5ee746bb2e108fef1c18759c312c0",
        "number": "0x2b890",
        "parent_hash": "0x06b0b202f0159c6eb0c2b52ee043869418305eb5e1a083a0031d1dd650cd5bf5",
        "proposals_hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "timestamp": "0x171d3bb0372",
        "transactions_root": "0x5ecdbf3e5c7ae848198b68cde8bf94e8693a67452cc55d7cc5862457774ef477",
        "uncles_hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "version": "0x0"
      }
    */

    const payload = {
      "id": 0,
      "jsonrpc": "2.0",
      "method": "get_header_by_number",
      "params": [
        hexNum
      ]
    }

    const observable = this.httpService.post(configService.CKB_RPC_ENDPOINT, payload)

    return observable.pipe(map(resp => {
      const block = resp.data.result
      return block;

    })).toPromise();

  }

  public async create(cell: Cell): Promise<Cell> {
    return await this.repo.save(cell)
  }
}
