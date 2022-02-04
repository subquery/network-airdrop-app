// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Address, Button, Dropdown, Typography } from '@subql/react-ui';
import { useWeb3 } from '../../containers';
import { injectedConntector } from '../../containers/Web3';
import styles from './Header.module.css';

export const Header: React.VFC = () => {
  const { account, activate, deactivate } = useWeb3();
  const { t } = useTranslation();
  const handleConnectWallet = React.useCallback(async () => {
    if (account) {
      deactivate();
      return;
    }

    try {
      await activate(injectedConntector);
    } catch (e) {
      console.log('Failed to activate wallet', e);
    }
  }, [activate, account, deactivate]);

  const handleSelected = (key: string) => {
    if (key === 'disconnect') {
      deactivate();
    }
  };

  return (
    <div className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <Link to="/">
            <img src="/static/logo.png" className={styles.logo} alt="SubQuery logo" />
          </Link>

          <Typography className={styles.hostedText}>{t('header.airdrop')}</Typography>
        </div>
        <div className={styles.right}>
          {account ? (
            <Dropdown
              items={[{ key: 'disconnect', label: 'Disconnect' }]}
              onSelected={handleSelected}
              colorScheme="gradient">
              <Address address={account} size="large" />
            </Dropdown>
          ) : (
            <Button
              type="secondary"
              label={t('header.connectWallet')}
              onClick={handleConnectWallet}
              leftItem={<i className="bi-link-45deg" role="img" aria-label="link" />}
            />
          )}
        </div>
      </div>
    </div>
  );
};
