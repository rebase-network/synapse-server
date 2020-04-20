import { JSBI } from '@nervosnetwork/ckb-sdk-utils';

export const bigintStrToNum = (str: string): number => {
  return Number(JSBI.BigInt(str).toString())
}