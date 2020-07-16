/// <reference types="@nervosnetwork/ckb-types" />
import { Controller, Get, Param, Query } from '@nestjs/common';
import { AddressService } from './address.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get('/capacity')
  @ApiQuery({
    name: 'lockHash',
    description: '这是需要传递的参数lockHash',
  })
  async getAddressInfo(
    @Query('lockHash') lockHash: string,
  ): Promise<{ capacity: string }> {
    return await this.addressService.getAddressInfo(lockHash);
  }
}
