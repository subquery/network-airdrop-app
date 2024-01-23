import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@subql/components';
import { Tabs } from 'antd';

import { Airdrop } from 'components';
import { BlockchainStatus } from 'components/BlockchainStatus';
import Challenges from 'components/Challenges/Challenges';
import { FAQ } from 'components/FAQ';
import PointsCard from 'components/PointsCard/PointsCard';
import Vesting from 'components/Vesting';
import { WalletDetect } from 'components/WalletDetect/WalletDetect';

import styles from './home.module.less';

export function Home() {
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState('Challenge');
  return (
    <div>
      <div className={styles.container}>
        <img src="static/airdrop.png" alt="airdrop page img" className={styles.bgImg} />

        <div style={{ position: 'relative', width: '100%', height: '100%', margin: '0 auto', padding: '80px 0' }}>
          <WalletDetect>
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
                    SubQuery Seekers Program and Airdrops
                  </Typography>
                  <PointsCard />
                </div>
                <Tabs
                  activeKey={activeKey}
                  onTabClick={(key) => {
                    setActiveKey(key);
                  }}
                  className={styles.tabs}
                  items={[
                    {
                      key: 'Challenge',
                      label: 'SubQuery Seekers Program'
                    },
                    {
                      key: 'Airdrop',
                      label: 'Other Airdrops'
                    }
                    /*
                      {
                        key: 'Vesting',
                        label: 'Private Sale Vesting'
                      }
                      */
                  ]}
                />
                {activeKey === 'Challenge' && <Challenges />}
                {activeKey === 'Airdrop' && (
                  <BlockchainStatus>
                    <Airdrop />
                  </BlockchainStatus>
                )}
                {activeKey === 'Vesting' && <Vesting />}
              </div>
            </div>
          </WalletDetect>
        </div>
      </div>
      <FAQ />
    </div>
  );
}
