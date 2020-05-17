type hex = string;

export interface TxFromIndexer {
  block_number: hex;
  io_index: hex;
  io_type: string;
  tx_hash: hex;
  tx_index: hex;
}

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
