import React, { useMemo } from 'react';
import { Typography } from '@subql/components';
import { ActiveEnum } from 'conf/enums';
import { base, baseSepolia, mainnet, sepolia } from 'viem/chains';

import { FAQ } from 'components';
import { BlockchainStatus } from 'components/BlockchainStatus';
import { WalletDetect } from 'components/WalletDetect/WalletDetect';

import styles from './home.module.less';

const rootUrl = new URL(window.location.href).hostname;

const airdropChain =
  process.env.REACT_APP_NETWORK === 'testnet'
    ? [
        {
          id: baseSepolia.id,
          name: baseSepolia.name
        },
        {
          id: sepolia.id,
          name: sepolia.name
        }
      ]
    : [
        {
          id: base.id,
          name: base.name
        },
        {
          id: mainnet.id,
          name: mainnet.name
        }
      ];

// seekers components
const Seekers = React.lazy(() => import('components/Challenges/Challenges'));
const SeekersPointsCard = React.lazy(() => import('components/PointsCard/PointsCard'));

// airdrop components
const AirdropCom = React.lazy(() => import('components/Airdrop/Airdrop'));
const L2Vesting = React.lazy(() => import('components/L2Vesting'));
const Vesting = React.lazy(() => import('components/Vesting'));

// DelegationCampaign component
const DelegationCampaign = React.lazy(() => import('components/DelegationCampaign/DelegationCampaign'));

export function Home() {
  const activeKey: ActiveEnum = useMemo(() => {
    if (rootUrl.includes('seekers')) {
      return ActiveEnum.Challenge;
    }

    if (rootUrl.includes('claim')) {
      return ActiveEnum.Airdrop;
    }

    return ActiveEnum.DelegatorCampaign;
  }, []);

  return (
    <div>
      <div className={styles.container}>
        {activeKey === ActiveEnum.Airdrop || activeKey === ActiveEnum.Challenge ? (
          <img src="static/airdrop.png" alt="airdrop page img" className={styles.bgImg} />
        ) : (
          ''
        )}

        {activeKey === ActiveEnum.DelegatorCampaign ? (
          <React.Suspense fallback={<div />}>
            <DelegationCampaign />
          </React.Suspense>
        ) : (
          ''
        )}
        {(activeKey === ActiveEnum.Airdrop || activeKey === ActiveEnum.Challenge) && (
          <div style={{ position: 'relative', width: '100%', height: '100%', margin: '0 auto', padding: '80px 0' }}>
            <div className={styles.airdropContainer}>
              <div className={styles.airdropContent}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexFlow: 'row wrap',
                    marginBottom: '1em'
                  }}
                >
                  <Typography variant="h4" weight={600} style={{ marginBottom: 32 }}>
                    {activeKey === 'Challenge' ? 'SubQuery Seekers Program' : 'SubQuery Token Claim'}
                  </Typography>
                  {activeKey === 'Challenge' ? (
                    <React.Suspense fallback={<div />}>
                      <SeekersPointsCard />
                    </React.Suspense>
                  ) : null}
                </div>
                {activeKey === 'Challenge' && (
                  <WalletDetect>
                    <React.Suspense fallback={<div />}>
                      <Seekers />
                    </React.Suspense>
                  </WalletDetect>
                )}
                {activeKey === 'Airdrop' && (
                  <WalletDetect mode="airdrop">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 64, width: '100%' }}>
                      <BlockchainStatus tipsChainIds={airdropChain}>
                        <React.Suspense fallback={<div />}>
                          <AirdropCom />
                        </React.Suspense>
                      </BlockchainStatus>

                      <BlockchainStatus tipsChainIds={airdropChain}>
                        <React.Suspense fallback={<div />}>
                          <L2Vesting />
                        </React.Suspense>
                      </BlockchainStatus>

                      <BlockchainStatus tipsChainIds={airdropChain}>
                        <React.Suspense fallback={<div />}>
                          <Vesting />
                        </React.Suspense>
                      </BlockchainStatus>
                    </div>
                  </WalletDetect>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <FAQ type={activeKey} />
    </div>
  );
}
