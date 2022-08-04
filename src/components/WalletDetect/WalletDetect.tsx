// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Toast } from '@subql/react-ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { injectedConntector, useWeb3 } from '../../containers';
import styles from './WalletDetect.module.css';
import { ConnectWallet } from './ConnectWallet';

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
  const { account, activate, error } = useWeb3();
  const { t } = useTranslation();

  const [errorAlert, setErrorAlert] = React.useState<string>();

  React.useEffect(() => {
    if (error) {
      setErrorAlert(error.message || 'Failed to connect wallet.');
    }
  }, [error]);

  const handleConnectWallet = React.useCallback(async () => {
    if (account) return;

    try {
      await activate(injectedConntector);
    } catch (e) {
      setErrorAlert((e as Error).message);
      console.log('Failed to activate wallet', e);
    }
  }, [activate, account]);

  if (!account) {
    return (
      <div className={clsx(styles.container, containerClassName)}>
        {errorAlert && <Toast state="error" text={errorAlert} className={styles.error} />}
        <ConnectWallet onConnect={handleConnectWallet} title={title} subTitle={subTitle} />
      </div>
    );
  }

  return <div className={styles.content}>{children}</div>;
};