// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Address, Button, Dropdown, Typography } from '@subql/react-ui';
import clsx from 'clsx';

import { injectedConntector, useWeb3 } from 'containers';

import styles from './Header.module.css';

const FOUNDATION_URL = 'https://subquery.foundation/';
const SUBQUERY_URL = 'https://www.subquery.network/';
const CLAIM_ENABLE = process.env.REACT_APP_CLAIM_ENABLED === 'true';

const HeaderLinks = () => {
  const { t } = useTranslation();
  const headerEntryLinks = [
    {
      url: FOUNDATION_URL,
      title: t('header.home')
    },
    {
      url: '/',
      title: t('header.claim')
    },
    {
      url: SUBQUERY_URL,
      title: t('header.network')
    }
  ];

  return (
    <div className={styles.textLinks}>
      {headerEntryLinks.map((headerLink) => {
        const isExternalLink = headerLink.url.startsWith('http');
        return isExternalLink ? (
          <a href={headerLink.url} target="_blank" key={headerLink.url} rel="noreferrer">
            <Typography className={styles.hostedText}>{headerLink.title}</Typography>
          </a>
        ) : (
          <Typography key={headerLink.url} className={clsx(styles.hostedText, styles.activeText)}>
            <Link to={headerLink.url}>{headerLink.title}</Link>
          </Typography>
        );
      })}
    </div>
  );
};

const WalletButton = () => {
  const { account, activate, deactivate, error } = useWeb3();
  const { t } = useTranslation();

  const handleSelected = (key: string) => {
    if (key === 'disconnect') {
      deactivate();
    }
  };

  const handleConnectWallet = React.useCallback(async () => {
    if (account || !CLAIM_ENABLE) {
      return;
    }

    try {
      await activate(injectedConntector);
    } catch (e) {
      console.log('Failed to activate wallet', e);
    }
  }, [activate, account, deactivate]);

  return account ? (
    <Dropdown items={[{ key: 'disconnect', label: 'Disconnect' }]} onSelected={handleSelected} colorScheme="gradient">
      <Address address={account} size="large" />
    </Dropdown>
  ) : (
    <Button
      type="secondary"
      label={t('header.connectWallet')}
      onClick={handleConnectWallet}
      leftItem={<i className="bi-link-45deg" role="img" aria-label="link" />}
    />
  );
};

export const Header: React.VFC = () => (
  <div className={styles.header}>
    <div className={styles.inner}>
      <div className={styles.left}>
        <a href={FOUNDATION_URL} target="_blank" rel="noreferrer">
          <img src="/static/sqFoundation.svg" className={styles.logo} alt="SubQuery logo" />
        </a>
      </div>
      <div className={styles.right}>
        <HeaderLinks />
        {CLAIM_ENABLE && <WalletButton />}
      </div>
    </div>
  </div>
);
