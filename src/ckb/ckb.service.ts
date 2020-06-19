/// <reference types="@nervosnetwork/ckb-types" />

import { Injectable } from '@nestjs/common';
import Core from '@nervosnetwork/ckb-sdk-core';
import { AddressPrefix } from '@nervosnetwork/ckb-sdk-utils';
import * as http from 'http';
import { configService } from '../config/config.service';
// const Agent = require('agentkeepalive');
import * as Agent from 'agentkeepalive';

@Injectable()
export class CkbService {
  private ckb: Core;
  private chain: AddressPrefix;

  constructor() {
    this.ckb = new Core(configService.CKB_RPC_ENDPOINT);
    this.chain = AddressPrefix.Mainnet;

    const keepaliveAgent = new Agent({
        maxSockets: 100,
        maxFreeSockets: 10,
        timeout: 60000, // active socket keepalive for 60 seconds
        freeSocketTimeout: 30000, // free socket keepalive for 30 seconds
      });

    this.ckb.rpc.setNode({
      httpAgent: new http.Agent(keepaliveAgent),
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
