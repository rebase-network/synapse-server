/// <reference types="@nervosnetwork/ckb-types" />
import { Controller, Get, Param } from '@nestjs/common';
import { AddressService } from './address.service'

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get(':address')
  async getCapacity(
    @Param('address') address: string,
  ): Promise<{ capacity: bigint }> {
    return await this.addressService.getCapacity(address);
  }
}
