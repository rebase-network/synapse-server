import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { CkbService } from '../ckb/ckb.service';
import { AddressRepository } from './address.repository';
import { Address } from '../model/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Address, AddressRepository])],
  controllers: [AddressController],
  providers: [AddressService, CkbService],
  exports: [AddressService],
})
export class AddressModule {}
