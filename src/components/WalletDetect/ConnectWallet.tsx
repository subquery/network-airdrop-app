// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { FaArrowRight } from 'react-icons/fa';
import { Alert, Typography } from '@subql/react-ui';

import { injectedConntector, useWeb3 } from 'containers';

import styles from './ConnectWallet.module.css';

interface IConnectWallet {
  title?: string;
  subTitle?: string;
  logoImgUrl?: string;
}

export const ConnectWallet: React.FC<IConnectWallet> = ({ title, subTitle, logoImgUrl }) => {
  const { t } = useTranslation();
  const { account, activate, error } = useWeb3();

  const handleConnectWallet = React.useCallback(async () => {
    if (account) return;

    try {
      await activate(injectedConntector);
    } catch (e) {
      console.log('Failed to activate wallet', e);
    }
  }, [activate, account]);

  return (
    <>
      <Typography variant="h6" className={styles.walletActionTitle}>
        {title ?? t('airdrop.eligible')}
      </Typography>

      <button onClick={handleConnectWallet} type="button" className={styles.walletActionButton}>
        <div>
          <div className={styles.walletMetamask}>
            <img src="/static/metamask.svg" className={styles.metmaskIcon} alt="Metamask logo" />
            <Typography className={styles.metamaskTitle}>{t('airdrop.metamask')}</Typography>
          </div>
          <Typography className={styles.walletActionText}>{t('airdrop.connectBrowserWallet')}</Typography>
        </div>
        <FaArrowRight className={styles.rightArrow} /> 
      </button>
      <div className={styles.switchToBrowserAlert}>
        <Alert className={styles.switchToBrowserText} state="info" text={t('wallet.useBrowserMetamask')} />
      </div>
    </>
  );
};
