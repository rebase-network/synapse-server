import { Test, TestingModule } from '@nestjs/testing';
import { AddressService } from '../address.service';
import { AddressRepository } from '../address.repository';
import { CkbService } from '../../ckb/ckb.service';

describe('AddressService', () => {
  let addressService;
  let addressRepository;

  const mockAddressRepository = () => ({
    findOne: jest.fn(),
  });

  class CKBServiceMock {
    async getCKB() {
      return 0;
    }
  }

  beforeEach(async () => {
    const CKBServiceProvider = {
      provide: CkbService,
      useClass: CKBServiceMock,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        {
          provide: AddressRepository,
          useFactory: mockAddressRepository,
        },
        CKBServiceProvider,
      ],
    }).compile();

    addressService = await module.get<AddressService>(AddressService);
    addressRepository = await module.get<AddressRepository>(AddressRepository);
  });

  describe('address service testing', () => {
    it('get address info by lockhash', async () => {
      const mockAddressInfoResult = {
        capacity: '9000',
      };
      addressRepository.findOne.mockResolvedValue(mockAddressInfoResult);
      const lockHash = '0xeeeeeeeeeeeeeee';
      const result = await addressService.getAddressInfo(lockHash);
      expect(result).toEqual(mockAddressInfoResult);
      expect(addressRepository.findOne).toHaveBeenCalledWith({lockHash});
    });
  });
});
