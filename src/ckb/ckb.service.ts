/// <reference types="@nervosnetwork/ckb-types" />

import { Injectable } from '@nestjs/common';
import Core from '@nervosnetwork/ckb-sdk-core';
import { AddressPrefix } from '@nervosnetwork/ckb-sdk-utils';
import * as http from 'http';
// import { ConfigService } from 'src/config/config.service';

const CKB_RPC_ENDPOINT = 'http://106.13.40.34:8114/'

@Injectable()
export class CkbService {
  private ckb: Core;
  private chain: AddressPrefix;

  // constructor(private readonly config: ConfigService) {
  constructor() {
    this.ckb = new Core(CKB_RPC_ENDPOINT);
    // this.ckb = new Core(this.configCKB_RPC_ENDPOINT);
    this.chain = AddressPrefix.Mainnet;

    this.ckb.rpc.setNode({
      httpAgent: new http.Agent({ keepAlive: true }),
    } as CKBComponents.Node);

    this.ckb.rpc.getBlockchainInfo().then(result => {
      // console.log('connect CKB chain rpc response', result);
      this.chain = result.chain as AddressPrefix;
    });
  }

  /**
   * return ckb instance
   */
  getCKB(): Core {
    return this.ckb;
  }

  /**
   * return ckb chain type "ckb" or "ckt"
   */
  getChain(): AddressPrefix {
    return this.chain;
  }
}
