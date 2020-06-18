/// <reference types="@nervosnetwork/ckb-types" />
import { Injectable } from '@nestjs/common';
import { CkbService } from '../ckb/ckb.service';
import { SyncstatRepository } from './syncstat.repository';

@Injectable()
export class SyncstatService {
  constructor(
    private readonly ckbService: CkbService,
    private readonly syncstatRepository: SyncstatRepository,
  ) {}

  private readonly ckb = this.ckbService.getCKB();

}
