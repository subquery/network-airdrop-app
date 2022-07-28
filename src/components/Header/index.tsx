// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Address, Button, Dropdown, Typography } from '@subql/react-ui';
import styles from './Header.module.css';
import { injectedConntector, useWeb3 } from '../../containers';

// TODO: improve dropdown button
export const Header: React.VFC = () => {
  const { account, activate, deactivate, error } = useWeb3();
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
          <a href="https://www.subquery.network/" target="_blank" rel="noreferrer">
            <img src="/static/logo.png" className={styles.logo} alt="SubQuery logo" />
          </a>
          <Link to="/">
            <Typography className={styles.hostedText}>{t('header.airdrop')}</Typography>
          </Link>
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
