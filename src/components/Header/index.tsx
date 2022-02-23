// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Address, Button, Dropdown, Typography } from '@subql/react-ui';
import styles from './Header.module.css';
import { hooks, metaMask } from '../../containers/metamask';
import { getAddChainParameters } from '../../containers/chains';

export const Header: React.VFC = () => {
  const { t } = useTranslation();
  const { useChainId, useAccounts, useIsActive } = hooks;

  const chainId = useChainId();
  const accounts = useAccounts();
  const isActive = useIsActive();

  const handleConnectWallet = () => {
    try {
      if (!isActive) {
        const result = getAddChainParameters(chainId || 1);

        metaMask.activate(result);
      }
    } catch (e: any) {
      console.log('error', e.message);
    }
  };

  const handleSelected = (key: string) => {
    if (key === 'disconnect') {
      metaMask.deactivate();
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
          {isActive && accounts ? (
            <Dropdown
              items={[{ key: 'disconnect', label: 'Disconnect' }]}
              onSelected={handleSelected}
              colorScheme="gradient">
              <Address address={accounts[0]} size="large" />
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
