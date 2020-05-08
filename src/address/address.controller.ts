/// <reference types="@nervosnetwork/ckb-types" />
import { Controller, Get, Param } from '@nestjs/common';
import { AddressService } from './address.service'

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get('capacity/:lockHash')
  async getCapacity(
    @Param('lockHash') lockHash: CKBComponents.Hash,
  ): Promise<CKBComponents.CapacityByLockHash> {
    return await this.addressService.getCapacity(lockHash);
  }
}
