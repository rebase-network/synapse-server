import { Test, TestingModule } from '@nestjs/testing';
import { CellService } from '../cell.service';
import { CellRepository } from '../cell.repository';
import { HttpService } from '@nestjs/common';
import { BlockService } from '../../block/block.service';
import { AddressService } from '../../address/address.service';
import { mockCellsResult, page, lockHash, step,mockTransactionResult, mockGetTxHistoriesResult } from './cell.data.spec';
import { CkbService } from '../../ckb/ckb.service';

describe('CellService', () => {
  let cellService;
  let cellRepository;
  let ckbService;

  // mock reposity
  const mockCellRepository = () => ({
    queryCellsByLockHash: jest.fn(),
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

  // 4- mock CKBService
  const mockCKBService = () => ({
    getCKB: ()=> {
        return {
            rpc: {
                getHeaderByNumber: blockNumber => Promise.resolve({ timestamp: '100' }),
                getTransaction: txHash => Promise.resolve(mockTransactionResult)
            }
        };
    }
  });
  const CKBServiceProvider = {
    provide: CkbService,
    // useClass: CKBServiceMock,
    useFactory: mockCKBService,
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
        CKBServiceProvider,
      ],
    }).compile();

    cellService = await module.get<CellService>(CellService);
    cellRepository = await module.get<CellRepository>(CellRepository);
    ckbService = await module.get<CkbService>(CkbService);
  });

  describe('get tx histories by lockScript', () => {
    it('get tx histories by lockScript', async () => {

        cellRepository.queryCellsByLockHash.mockResolvedValue(mockCellsResult);

      const result = await cellService.getTxHistoriesByLockHash(
        lockHash,
        step,
        page,
      );

      expect(result).toEqual(mockGetTxHistoriesResult);
      expect(cellRepository.queryCellsByLockHash).toHaveBeenCalledWith(
        lockHash,
        step,
        page,
      );
    });
  });
});
