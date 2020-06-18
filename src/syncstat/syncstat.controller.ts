/// <reference types="@nervosnetwork/ckb-types" />
import { Controller } from '@nestjs/common';
import { SyncstatService } from './syncstat.service';

@Controller('syncstat')
export class SyncstatController {
  constructor(private readonly syncstatService: SyncstatService) {}
}
