import { useWalletAgent } from '@/providers/WalletProvider';
import { WalletContext } from '@/providers/WalletProvider/context';
import { useRequest } from 'ahooks';
import { useContext } from 'react';

export function useChainId() {
  const { chainId } = useContext(WalletContext);
  return chainId;
  // const agent = useWalletAgent();

  // const result = useRequest(
  //   async () => {
  //     if (!agent) return 0;

  //     const web3 = await agent.getWeb3();
  //     if (!web3) return 0;

  //     const chainId = await web3.eth.getChainId();
  //     return chainId;
  //   },
  //   {
  //     refreshDeps: [agent],
  //   },
  // );

  // return result;
}
