// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button, Toast } from '@subql/react-ui';
import { Typography } from 'antd';
import clsx from 'clsx';

import { DISCORD_KEPLER_SUPPORT_URL } from 'appConstants';

import { useWeb3 } from '../../containers';
import { ConnectWallet } from './ConnectWallet';
import styles from './WalletDetect.module.css';

const CLAIM_ENABLE = process.env.REACT_APP_CLAIM_ENABLED === 'true';

const AirdropReadMore = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.notYetOpen}>
      <Button
        type="primary"
        className={styles.linkText}
        label={t('airdrop.notYetOpenReadMore')}
        href="https://blog.subquery.network/subquery-announces-details-of-subquery-kepler-airdrop"
        target="_blank"
      />

      <Typography.Text className={styles.notYetOpenText}>{t('airdrop.notYetOpen')}</Typography.Text>
    </div>
  );
};

interface IWalletDetect {
  title?: string;
  subTitle?: string;
  containerClassName?: string;
  walletConnectorClassName?: string;
}
export const WalletDetect: React.FC<IWalletDetect> = ({
  title,
  subTitle,
  children,
  containerClassName,
  walletConnectorClassName
}) => {
  const { account, error } = useWeb3();
  const { t } = useTranslation();

  const [errorAlert, setErrorAlert] = React.useState<string>();

  React.useEffect(() => {
    if (error) {
      setErrorAlert(error.message || 'Failed to connect wallet.');
    }
  }, [error]);

  if (!account) {
    return (
      <div className={clsx(styles.container, containerClassName)}>
        <div>
          {errorAlert && <Toast state="error" text={errorAlert} className={styles.error} />}
          <div className={styles.walletActionContainer}>
            <span className={styles.title}>{t('airdrop.title')}</span>
            {CLAIM_ENABLE && <ConnectWallet title={title} subTitle={subTitle} />}
            {!CLAIM_ENABLE && <AirdropReadMore />}
          </div>
        </div>
        <div className={styles.contact}>
          <Typography.Text className={styles.contactText}>
            <Trans i18nKey="support.contact">
              If you have any questions, contact us at
              <a type="link" href={DISCORD_KEPLER_SUPPORT_URL} target="_blank" rel="noreferrer">
                #kepler-support
              </a>
              channel on Discord
            </Trans>
          </Typography.Text>
        </div>
      </div>
    );
  }

  return <div className={styles.content}>{children}</div>;
};
