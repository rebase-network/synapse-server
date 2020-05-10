import { Injectable, HttpService } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
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

  public getTxHistoryByPubkeyHash(pubkeyHash: string): Promise<any> {
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
        "desc", // 倒叙排列，最近的20条交易记录
        "0x14" // 20
      ]
    }

    const observable = this.httpService.post(configService.CKB_INDEXER_ENDPOINT, payload)

    return observable.pipe(map(resp => {
      const txs = resp.data.result.objects
      console.log("txs num: ", txs.length);

      if (txs.length === 0) return null;
      return this.blockService.parseBlockTxs(txs)
    })).toPromise();

  }

  public async create(cell: Cell): Promise<Cell> {
    return await this.repo.save(cell)
  }
}
