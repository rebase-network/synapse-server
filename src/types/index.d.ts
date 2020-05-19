type hex = string;

export interface ReadableCell {
  capacity: bigint;
  lockHash: string;
  lockArgs: string;
  lockCodeHash: string;
  lockHashType: string;
  address: string; // TODO: delete
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


interface LockhashCapacity {
  capacity: string;
  lockHash: string;
  lockScript: CKBComponents.Script;
}

interface LockhashCapacityObj {
  address: LockhashCapacity
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
    address: string; // TODO: delete me
  }
}