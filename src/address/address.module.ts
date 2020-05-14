import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { Address as AddressEntiry } from '../model/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntiry])],
  controllers: [AddressController],
  providers: [AddressService]
})
export class AddressModule {}
