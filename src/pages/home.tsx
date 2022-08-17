import { useTranslation } from 'react-i18next';
import { Button, Typography } from 'antd';

import { DISCORD_INVITE_URL, DISCORD_KEPLER_SUPPORT_URL } from 'appConstants';
import { Airdrop } from 'components';
import { BlockchainStatus } from 'components/BlockchainStatus';
import { FAQ } from 'components/FAQ';
import { WalletDetect } from 'components/WalletDetect/WalletDetect';

import styles from './home.module.css';

const JoinDiscord = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.supportContainer}>
      <Button type="primary" ghost href={DISCORD_INVITE_URL} shape="round" size="large" target="_blank">
        {t('support.joinDiscord')}
      </Button>
      <Typography.Text className={styles.text}>
        {t(`support.turnOnNotificationPart1`)}<a href={DISCORD_KEPLER_SUPPORT_URL}>#announcement</a>{t(`support.turnOnNotificationPart2`)}
      </Typography.Text>
    </div>
  );
};

export function Home() {
  const { t } = useTranslation();
  return (
    <div>
      <div className={styles.container}>
        <img src="static/airdrop.png" alt="airdrop page img" className={styles.bgImg} />
        <BlockchainStatus>
          <WalletDetect>
            <div className={styles.airdropContainer}>
              <div className={styles.airdropContent}>
                <Airdrop />
                <JoinDiscord />
              </div>
              <Typography.Text className={styles.text}>
                {t(`support.contactPart1`)}<a href={DISCORD_KEPLER_SUPPORT_URL}>#kepler-airdrop-support</a>{t(`support.contactPart2`)}
              </Typography.Text>
            </div>
          </WalletDetect>
        </BlockchainStatus>
      </div>

      <FAQ />
    </div>
  );
}
