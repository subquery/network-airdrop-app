import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Typography } from '@subql/components';
import { Button, Tabs } from 'antd';

import { DISCORD_ANNOUNCEMENTS_URL, DISCORD_INVITE_URL, DISCORD_KEPLER_SUPPORT_URL } from 'appConstants';
import { Airdrop } from 'components';
import { BlockchainStatus } from 'components/BlockchainStatus';
import { FAQ } from 'components/FAQ';
import Vesting from 'components/Vesting';
import { WalletDetect } from 'components/WalletDetect/WalletDetect';

import styles from './home.module.less';

const JoinDiscord = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.supportContainer}>
      <Button type="primary" ghost href={DISCORD_INVITE_URL} shape="round" size="large" target="_blank">
        {t('support.joinDiscord')}
      </Button>
      <Typography className={styles.text}>
        <Trans i18nKey="support.turnOnNotification">
          Make sure you turn on notifications for the
          <a type="link" href={DISCORD_ANNOUNCEMENTS_URL} target="_blank" rel="noreferrer">
            #announcement
          </a>
          channel so you don’t miss any update
        </Trans>
      </Typography>
    </div>
  );
};

export function Home() {
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState('Airdrop');
  return (
    <div>
      <div className={styles.container}>
        <img src="static/airdrop.png" alt="airdrop page img" className={styles.bgImg} />
        <div style={{ position: 'relative', width: '100%', height: '100%', margin: 'auto' }}>
          <BlockchainStatus>
            <WalletDetect>
              <div className={styles.airdropContainer}>
                <div className={styles.airdropContent}>
                  <Typography variant="h4" weight={600} style={{ marginBottom: 32 }}>
                    SubQuery Community Airdrops and Token Vesting
                  </Typography>
                  <Tabs
                    activeKey={activeKey}
                    onTabClick={(key) => {
                      setActiveKey(key);
                    }}
                    className={styles.tabs}
                    items={[
                      {
                        key: 'Airdrop',
                        label: 'Airdrop'
                      },
                      {
                        key: 'Vesting',
                        label: 'Vesting'
                      }
                    ]}
                  />

                  {activeKey === 'Airdrop' && (
                    <>
                      <Airdrop /> <JoinDiscord />
                    </>
                  )}
                  {activeKey === 'Vesting' && <Vesting />}
                </div>
                <Typography className={styles.text} style={{ marginTop: 32 }}>
                  <Trans i18nKey="support.contact">
                    If you have any questions, contact us at
                    <a type="link" href={DISCORD_KEPLER_SUPPORT_URL} target="_blank" rel="noreferrer">
                      #kepler-support
                    </a>
                    channel on Discord
                  </Trans>
                </Typography>
              </div>
            </WalletDetect>
          </BlockchainStatus>
        </div>
      </div>
      <FAQ />
    </div>
  );
}
