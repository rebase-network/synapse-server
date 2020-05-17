type hex = string;

export interface ReadableCell {
  capacity: bigint;
  address: string;
}

export interface ReadableTx {
  hash: string;
  blockNum: number;
  timestamp: number;
  outputs: [ReadableCell];
  inputs: [ReadableCell];
  fee: number;
  income: boolean;
  amount: number;
}

export interface TxFromIndexer {
  block_number: hex;
  io_index: hex;
  io_type: string;
  tx_hash: hex;
  tx_index: hex;
}
declare namespace Indexer {
  export interface QueryTxParams {
    script: CKBComponents.Script;
    scriptType: string;
    order: string;
    limit: string;
    afterCursor?: string;
    address: string;
  }
}