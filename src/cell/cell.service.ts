/// <reference types="@nervosnetwork/ckb-types" />
import { Injectable, HttpService } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import * as Types from '../types';
import { Cell as CellEntity } from '../model/cell.entity';
import { Cell } from './interfaces/cell.interface';
import { configService } from '../config/config.service';
import { BlockService } from '../block/block.service';

@Injectable()
export class CellService {
  constructor(
    @InjectRepository(CellEntity) private readonly repo: Repository<CellEntity>,
    private readonly httpService: HttpService,
    private readonly blockService: BlockService
  ) { }

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


  public getTxHistories(params: Types.Indexer.QueryTxParams): Promise<any> {
    const { script, scriptType, order = 'desc', limit = '0x14' } = params;
    const payload = {
      id: 0,
      jsonrpc: "2.0",
      method: "get_transactions",
      params: [
        { script: script, 'script_type': scriptType },
        order,
        limit,
      ]
    }

    const observable = this.httpService.post(configService.CKB_INDEXER_ENDPOINT, payload)

    return observable.pipe(map(resp => {
      const txs = resp.data.result.objects
      console.log("txs num: ", txs.length);

      if (txs.length === 0) return null;
      const txsWithUniqueHash: Types.TxFromIndexer[] = _.uniqBy(txs, 'tx_hash');;
      return this.blockService.parseBlockTxs(txsWithUniqueHash)
    })).toPromise();

  }

  public async create(cell: Cell): Promise<Cell> {
    return await this.repo.save(cell)
  }
}
