/// <reference types="@nervosnetwork/ckb-types" />
import { Controller, Get, Param } from '@nestjs/common';
import { AddressService } from './address.service'

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get(':lockHash')
  async getAddressInfo(
    @Param('lockHash') lockHash: string,
  ): Promise<{ capacity: string }> {
    return await this.addressService.getAddressInfo(lockHash);
  }
}
