import { Test, TestingModule } from '@nestjs/testing';
import { BlockService } from './block.service';

describe('BlockService', () => {
  let service: BlockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockService],
    }).compile();

    service = module.get<BlockService>(BlockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be get blocks from ckb rpc', () => {
    const sync = jest.fn(service.sync);
    sync();
    expect(sync).toHaveReturned();
  });
});
