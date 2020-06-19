import { Repository, EntityRepository } from 'typeorm';
import { Address } from '../model/address.entity';

@EntityRepository(Address)
export class AddressRepository extends Repository<Address> {

}
