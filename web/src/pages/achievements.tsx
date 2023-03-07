import type React from 'react';
import { useWallet } from '@/providers/WalletProvider';
import { AchievementCard } from '@/components/Achievement';
import styles from './achievements.less';
import { Alert, Button, Col, Modal, Row } from 'antd';
import { NumberCard } from '@/components/Tokens';
import { useRequest } from 'ahooks';
import { listBadgeStatus } from '@/services/api';
import { useERC20Balance } from '@/hooks/web3/useERC20Balance';
import { FTT_ADDRESS, TARGET_NETWORK } from '@/consts';
import { readableTokens } from '@/utils';
import { ThemeButton } from '@/components/Button';
import { globalEvent } from '@/utils/events';
import { useChainId } from '@/hooks/web3/useChainId';

const AchievementPage: React.FC<{}> = (props) => {
  const { account, connected } = useWallet();

  const badgeReq = useRequest(
    () =>
      listBadgeStatus({
        address: account || '0x0000000000000000000000000000000000000000',
        scenes: Scenes,
      }),
    {
      refreshDeps: [account],
    },
  );

  const tokenBalance = useERC20Balance(FTT_ADDRESS, account);

  const badges = badgeReq.data || LoadingScenes;
  const chainId = useChainId();

  const { run: switchNetwork, loading: switchingNetwork } = useRequest(
    async () => {
      try {
        // @ts-ignore
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${TARGET_NETWORK.chainId.toString(16)}` }], // chainId must be in hexadecimal numbers
        });
      } catch (err) {
        // @ts-ignore
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              ...TARGET_NETWORK,
              chainId: `0x${TARGET_NETWORK.chainId.toString(16)}`,
            },
          ],
        });
      }
    },
    {
      manual: true,
    },
  );

  return (
    <div className={styles.page}>
      {connected && chainId !== 0 && chainId !== TARGET_NETWORK.chainId && (
        <Modal visible closable={false} footer={false} centered>
          <Alert
            type="info"
            message={
              <>
                Please use Fantom network
                <Button
                  type="link"
                  loading={switchingNetwork}
                  onClick={switchNetwork}
                >
                  Switch to Fantom
                </Button>
              </>
            }
          />
        </Modal>
      )}

      <Title loading={tokenBalance.loading}>My Tokens</Title>

      {account ? (
        <Row justify="center">
          <Col>
            <NumberCard number={readableTokens(tokenBalance.data || '0')} />
          </Col>
        </Row>
      ) : (
        <ThemeButton
          style={{ display: 'block', margin: '0 auto' }}
          onClick={() => globalEvent.openConnectWalletModal()}
        >
          Connect Wallet
        </ThemeButton>
      )}

      <Title loading={badgeReq.loading}> My Achievements </Title>
      <div className={styles.tip}>
        <span>FindTruman badges will be minted on chain. </span>
      </div>

      <Row gutter={[24, 24]}>
        {badges.map((a) => (
          <Col key={a.scene} span={12}>
            <AchievementCard
              style={{ width: '100%' }}
              scene={a.scene}
              name={a.name}
              image={a.image}
              desc={a.description}
              got={a.claimable}
              tokens={a.tokens}
              badgeId={a.badgeId}
              achievementProofs={a.achievementProofs}
              tokensProofs={a.tokensProofs}
              onStatusChanged={tokenBalance.run}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

const Title: React.FC<{ children?: React.ReactNode; loading?: boolean }> = (
  props,
) => {
  return (
    <div className={styles.title}>
      {props.children}
      {props.loading && <div>Loading...</div>}
    </div>
  );
};

const Scenes = ['black-water-lake', 'bloody-church', 'the-trip', 'the-abyss'];

const LoadingScenes = Scenes.map((scene) => ({
  scene: scene,
  name: 'Loading',
  image: 'https://findtruman.io/favicon.png',
  description: 'The exciting scene is coming soon, please be patient',
  claimable: false,
  tokens: 200,
  badgeId: null,
  achievementProofs: [],
  tokensProofs: [],
}));

export default AchievementPage;
