import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { CellService } from './cell.service';
import { LoggingInterceptor } from '../logging.interceptor';
import * as ckbUtils from '@nervosnetwork/ckb-sdk-utils';

@Controller('cell')
@UseInterceptors(LoggingInterceptor)
export class CellController {
  constructor(private readonly cellService: CellService) {}

  @Get('getBalanceByPubkeyHash/:pubkeyHash')
  async getBalanceByPubkeyHash(@Param('pubkeyHash') pubkeyHash: string): Promise<number> {
    return await this.cellService.getBalanceByPubkeyHash(pubkeyHash)
  }

  @Get('getBalanceByAddress/:address')
  async getBalanceByAddress(@Param('address') address: string): Promise<number> {
    return await this.cellService.getBalanceByAddress(address)
  }

  @Get('getTxByTxHash/:txHash')
  async getTxByTxHash(@Param('txHash') txHash: string): Promise <any> {
    return await this.cellService.getTxByTxHash(txHash)
  }

  @Get('getHeaderByNum/:hexNum')
  async getHeaderByNum(@Param('hexNum') hexNum: string): Promise <any> {
    return await this.cellService.getHeaderByNum(hexNum)
  }

  @Get('getTxsByAddress/:address')
  async getTxsByPubkeyHash(@Param('address') address: string): Promise <any> {
    const parsedHex = ckbUtils.bytesToHex(ckbUtils.parseAddress(address))
    const pubkeyHash = "0x" + parsedHex.toString().slice(6)

    const txs = await this.cellService.getTxsByPubkeyHash(pubkeyHash)

    const opts: ckbUtils.AddressOptions = {
      prefix: ckbUtils.AddressPrefix.Testnet,
      type: ckbUtils.AddressType.HashIdx,
      codeHashOrCodeHashIndex: '0x00',
    }

    let newTxs = []
    for (const tx of txs) {
      let newTx = {}

      newTx['hash'] = tx.tx_hash
      newTx['block_num'] = parseInt(tx.block_number, 16)

      const header = await this.cellService.getHeaderByNum(tx.block_number)
      const txObj = await this.cellService.getTxByTxHash(tx.tx_hash)

      newTx['timestamp'] = parseInt(header.timestamp, 16)

      const outputs = txObj.outputs
      const inputs = txObj.inputs

      console.log("outputs num: ", outputs.length);
      console.log("inputs num: ", inputs.length);

      let newInputs = []

      for (const input of inputs) {
        let newInput = {}
        const bef_tx_hash = input.previous_output.tx_hash
        const bef_index = input.previous_output.index

        const inputTxObj = await this.cellService.getTxByTxHash(bef_tx_hash)
        const _output = inputTxObj.outputs[parseInt(bef_index, 16)]

        newInput['capacity'] = parseInt(_output.capacity, 16)
        newInput['address'] = ckbUtils.bech32Address(_output.lock.args, opts)

        newInputs.push(newInput)
      }

      newTx['inputs'] = newInputs

      let newOutputs = []

      for (const output of outputs) {
        let newOutput = {}
        newOutput['capacity'] = parseInt(output.capacity, 16)
        newOutput['address'] = ckbUtils.bech32Address(output.lock.args, opts)
        newOutputs.push(newOutput)
      }

      newTx['outputs'] = newOutputs
      newTxs.push(newTx)
    }

    return newTxs

  }
}
