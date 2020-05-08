/// <reference types="@nervosnetwork/ckb-types" />
import { Injectable } from '@nestjs/common';
import { CkbService } from '../ckb/ckb.service';

@Injectable()
export class AddressService {
  constructor(
    private readonly ckbService: CkbService
  ) { }

  private readonly ckb = this.ckbService.getCKB();

  async getCapacity(lockHash: CKBComponents.Hash): Promise<CKBComponents.CapacityByLockHash> {
    const result = await this.ckb.rpc.getCapacityByLockHash(lockHash)
    if (!result) {
      return { capacity: '0', cellsCount: '0', blockNumber: '0' }
    }
    return {
      capacity: result.capacity,
      cellsCount: result.cellsCount,
      blockNumber: result.blockNumber
    }
  }
}
