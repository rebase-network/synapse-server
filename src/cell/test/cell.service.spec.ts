import { Test, TestingModule } from '@nestjs/testing';
import { CellService } from '../cell.service';
import { CellRepository } from '../cell.repository';
import { HttpService } from '@nestjs/common';
import { BlockService } from '../../block/block.service';
import { AddressService } from '../../address/address.service';

describe('AddressService', () => {
  let cellService;

  // mock reposity
  const mockCellRepository = () => ({
    findOne: jest.fn(),
  });

  // 1-mock httpService
  class HttpServiceMock {}
  const HttpServiceProvider = {
    provide: HttpService,
    useClass: HttpServiceMock,
  };

  // 2-mock blockService
  class BlockServiceMock {}
  const BlockServiceProvider = {
    provide: BlockService,
    useClass: BlockServiceMock,
  };
  // 3- mock AddressService
  class AddressServiceMock {}
  const AddressServiceProvider = {
    provide: AddressService,
    useClass: AddressServiceMock,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CellService,
        {
          provide: CellRepository,
          useFactory: mockCellRepository,
        },
        HttpServiceProvider,
        BlockServiceProvider,
        AddressServiceProvider,
      ],
    }).compile();

    cellService = await module.get<CellService>(CellService);
  });

  describe('get tx histories by lockScript', () => {
    it('get tx histories by lockScript', async () => {
      console.log('mock testing');
    });
  });
});
