// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Address, Button, Dropdown, Typography } from '@subql/react-ui';
import clsx from 'clsx';

import { injectedConntector, useWeb3 } from 'containers';

import { isOpen } from '../WalletDetect/ConnectWallet';
import styles from './Header.module.css';

const FOUNDATION_URL = 'https://subquery.foundation/';
const SUBQUERY_URL = 'https://www.subquery.network/';

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
          <a href={FOUNDATION_URL} target="_blank" rel="noreferrer">
            <img src="/static/sqFoundation.svg" className={styles.logo} alt="SubQuery logo" />
          </a>
        </div>
        <div className={styles.right}>
          <HeaderLinks />
          {isOpen ? (
            account ? (
              <Dropdown
                items={[{ key: 'disconnect', label: 'Disconnect' }]}
                onSelected={handleSelected}
                colorScheme="gradient"
              >
                <Address address={account} size="large" />
              </Dropdown>
            ) : (
              <Button
                type="secondary"
                label={t('header.connectWallet')}
                onClick={handleConnectWallet}
                leftItem={<i className="bi-link-45deg" role="img" aria-label="link" />}
              />
            )
          ) : null}
        </div>
      </div>
    </div>
  );
};
