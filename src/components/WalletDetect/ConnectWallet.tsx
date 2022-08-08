// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { FaArrowRight } from 'react-icons/fa';
import { Alert,Button, Typography } from '@subql/react-ui';

import styles from './ConnectWallet.module.css';

const Wallet: React.VFC<{ name: string; icon: string; onClick?: () => void }> = ({ name, icon, onClick }) => {
  const { t } = useTranslation();

  return (
    <Button
      type="secondary"
      label=""
      className={styles.walletContainer}
      onClick={onClick}
      leftItem={
        <div className={styles.wallet}>
          <div>
            <img src={icon} alt="wallet logo" className={styles.walletIcon} />

            <Typography variant="body" className={styles.walletSubtitle}>
              {t('connectWallet.metamaskDesc')}
            </Typography>
          </div>
          <i className={['bi-arrow-right', styles.arrow].join(' ')} role="img" aria-label="arrow right" />
        </div>
      }
    />
  );
};

interface IConnectWallet {
  onConnect: () => void;
  title?: string;
  subTitle?: string;
  logoImgUrl?: string;
}

export const ConnectWallet: React.FC<IConnectWallet> = ({ onConnect, title, subTitle, logoImgUrl }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.walletActionContainer}>
      <Typography variant="h6" className={styles.walletActionTitle}>
        {title ?? t('airdrop.eligible')}
      </Typography>
      <Typography variant="h6" className={styles.walletActionTitle}>
        {subTitle ?? t('airdrop.connectWallet')}
      </Typography>

      <button onClick={onConnect} type="button" className={styles.walletActionButton}>
        <div>
          <img src="/static/metamaskBanner.png" className={styles.logo} alt="Metamask logo" />
          <Typography className={styles.walletActionText}>{t('airdrop.connectBrowserWallet')}</Typography>
        </div>
        <FaArrowRight className={styles.rightArrow} />
      </button>
      <div className={styles.switchToBrowserAlert}>
        <Alert className={styles.switchToBrowserText} state="info" text={t('wallet.useBrowserMetamask')} />
      </div>
    </div>
  );
};
