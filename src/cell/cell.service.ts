import { Injectable, HttpService } from '@nestjs/common';
import { Observable, } from 'rxjs';
import { map } from 'rxjs/operators';
import { AxiosResponse } from 'axios';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cell as CellEntity } from '../model/cell.entity';
import { Cell } from './interfaces/cell.interface';
import { configService } from '../config/config.service';

@Injectable()
export class CellService {
  constructor(@InjectRepository(CellEntity) private readonly repo: Repository <CellEntity> ,
    private readonly httpService: HttpService
  ) {}

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
        "asc",
        "0x200" // 512
      ]
    }

    const observable = this.httpService.post(configService.CKB_INDEXER_RPC_ENDPOINT, payload)

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

  public async create(cell: Cell): Promise<Cell> {
    return await this.repo.save(cell)
  }
}
