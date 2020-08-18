export interface TxHistory {
  blockNumber: string;
  txHash: string;
}

export interface ReadableCell {
  capacity: number;
  lockHash: string;
  lockCodeHash: string;
  lockArgs: string;
  lockHashType: string;
  typeHash: string;
  sudt: number;
}

export interface NewTx {
  hash: string;
  blockNum: number;
  timestamp: number;
  inputs: any[];
  outputs: any[];
}

export interface BlockNumberAndTxHash {
  blockNumber: string;
  txHash: string;
}
