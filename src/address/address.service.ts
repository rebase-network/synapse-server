/// <reference types="@nervosnetwork/ckb-types" />
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Address as AddressEntity } from '../model/address.entity'
import { CkbService } from '../ckb/ckb.service';

@Injectable()
export class AddressService {
  constructor(
    private readonly ckbService: CkbService,
    @InjectRepository(AddressEntity) private readonly repo: Repository<AddressEntity>,
  ) { }

  private readonly ckb = this.ckbService.getCKB();

  /**
   * get capacity by address
   * @param lockHash the hash of lock script
   */
  async getCapacity(lockHash: string): Promise<{ capacity: string }> {
    const result = await this.repo.findOne({ lockHash });
    if (!result) {
      return { capacity: '0' }
    }
    return {
      capacity: result.capacity.toString(),
    }
  }
}
