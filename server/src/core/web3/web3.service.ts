import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { TransactionReceipt } from 'web3-core';
import { ethers } from 'ethers';

@Injectable()
export class Web3Service {
  private clients: Record<string, Web3> = {};

  constructor(private readonly configService: ConfigService) {}

  async ecRecover(encrypted: string, sig: string): Promise<string> {
    const recoveredAddr = ethers.utils.verifyMessage(encrypted, sig);
    return recoveredAddr.toLowerCase();
  }

  getCachedClient(endpoint: string): Web3 {
    if (this.clients[endpoint] === undefined) {
      this.clients[endpoint] = new Web3(endpoint);
    }
    return this.clients[endpoint];
  }

  async call<Args extends any[], R>(
    method: string,
    args: Args,
    opts: {
      endpoint: string;
      abi: AbiItem[];
      address: string;
    },
  ): Promise<R> {
    const client = this.getCachedClient(opts.endpoint);
    const contract = new client.eth.Contract(opts.abi, opts.address);
    const result = await contract.methods[method](...args).call();
    return result;
  }

  async send<Args extends any[]>(
    method: string,
    args: Args,
    opts: {
      endpoint: string;
      abi: AbiItem[];
      address: string;
      fromPk: string;
    },
  ): Promise<TransactionReceipt> {
    const client = this.getCachedClient(opts.endpoint);

    const contract = new client.eth.Contract(opts.abi, opts.address);

    const { address } = client.eth.accounts.wallet.add(opts.fromPk);
    const prevGasPrice = await client.eth.getGasPrice();
    const gasPrice = parseInt(prevGasPrice) + 1000000000;

    const receipt: TransactionReceipt = await contract.methods[method](
      ...args,
    ).send({ from: address, gas: 2000000, gasPrice });

    return receipt;
  }

}
