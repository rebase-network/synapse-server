/// <reference types="@nervosnetwork/ckb-types" />
import { Controller } from '@nestjs/common';
import { AddressService } from './address.service';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}
}
