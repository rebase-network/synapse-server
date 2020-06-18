/// <reference types="@nervosnetwork/ckb-types" />
import { Injectable } from '@nestjs/common';
import { CkbService } from '../ckb/ckb.service';
import { AddressRepository } from './address.repository';

@Injectable()
export class AddressService {
  constructor(
    private readonly ckbService: CkbService,

    private readonly addressRepository: AddressRepository,
  ) { }

  private readonly ckb = this.ckbService.getCKB();

  /**
   * get capacity by address
   * @param lockHash the hash of lock script
   */
  async getAddressInfo(lockHash: string): Promise<{ capacity: string }> {
    const result = await this.addressRepository.findOne({ lockHash });
    if (!result) {
      return { capacity: '0' }
    }
    return {
      capacity: result.capacity.toString(),
    }
  }
}
