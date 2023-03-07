import { useWalletAgent } from '@/providers/WalletProvider';
import { useRequest } from 'ahooks';
import type { AbiItem } from 'web3-utils';
import { useChainId } from './useChainId';
const Abi: AbiItem[] = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_addr',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_sceneId',
        type: 'uint256',
      },
    ],
    name: 'formatClaimableAchievementLeaf',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'usedMerkleLeaf',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export function useFTCCanClaimBadge(
  contract: string,
  account: string,
  badgeId: number,
  proofs: string[],
) {
  // 1. hasProofs && leaf not used => 'claimable'
  // 2. not Proofs => 'unclaimable'
  // 3. hasProofs && leaf used => 'claimed'

  const agent = useWalletAgent();
  const chainId = useChainId();

  return useRequest(
    async () => {
      if (
        !account ||
        !contract ||
        !badgeId ||
        !proofs ||
        proofs.length === 0 ||
        !agent
      )
        return 'unclaimable';

      const web3 = await agent.getWeb3();
      if (!web3) return 'unclaimable';

      const instance = new web3.eth.Contract(Abi, contract);

      const leaf = await instance.methods['formatClaimableAchievementLeaf'](
        account,
        badgeId,
      ).call();
      const used = await instance.methods['usedMerkleLeaf'](leaf).call();
      return used ? 'claimed' : 'claimable';
    },
    {
      refreshDeps: [contract, badgeId, proofs, account, agent, chainId],
    },
  );
}
