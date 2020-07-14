import { Test, TestingModule } from '@nestjs/testing';
import { AddressController } from '../address.controller';
import { AddressService } from '../address.service';

describe('Address Controller', () => {
  let controller: AddressController;

  class AddressServiceMock {
    async getAddressInfo() {
      console.log('Mock Method');
      return { capacity: '9000' };
    }
  }

  beforeEach(async () => {
    const AddressServiceProvider = {
      provide: AddressService,
      useClass: AddressServiceMock,
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressController],
      providers: [AddressServiceProvider],
    }).compile();

    controller = module.get<AddressController>(AddressController);
    // addressService = module.get<AddressService>(AddressService);
  });

  describe('address controller testing', () => {
    it('get address info by lockhash', async () => {
      const mockAddressInfoResult = {
        capacity: '9000',
      };
      const lockHash = '0xeeeeeeeeeeeeeee';
      const result = await controller.getAddressInfo(lockHash);
      expect(result).toEqual(mockAddressInfoResult);
    });
  });
});
