// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useTranslation } from 'react-i18next';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Typography } from '@subql/components';
import { Button } from 'antd';
import clsx from 'clsx';
import { useAccount } from 'wagmi';

import styles from './WalletDetect.module.css';

export const ContactUs = () => (
  <div style={{ width: '100%', textAlign: 'center' }}>
    <Typography type="secondary">
      If you have any issues or questions, contact us on the{' '}
      <Typography.Link active href="https://subquery.network/privacy" variant="medium">
        #airdrop-support
      </Typography.Link>{' '}
      channel on our Discord
    </Typography>
  </div>
);

export const ConnectWalletCom: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={clsx(styles.container)}>
      <Typography variant="h4" weight={600} style={{ textAlign: 'center' }}>
        Join SubQuery’s 50 Million SQT Community Airdrop!
      </Typography>
      <Typography variant="text" type="secondary" style={{ textAlign: 'center' }}>
        We are giving away 50 Million SQT to our most valued community members in our largest airdrop yet! Connect your
        wallet and complete onboarding to instantly receive 200 points.
      </Typography>
      <Typography type="secondary">The program closes on the 15th of February so be quick!</Typography>

      <ConnectButton.Custom>
        {({ openConnectModal }) => (
          <Button
            shape="round"
            size="large"
            onClick={() => openConnectModal()}
            type="primary"
            style={{ width: '100%', background: 'var(--sq-blue600)' }}
            className={styles.connectBtn}
          >
            Connect Wallet
          </Button>
        )}
      </ConnectButton.Custom>

      <ContactUs />
    </div>
  );
};

interface IWalletDetect {
  containerClassName?: string;
}
export const WalletDetect: React.FC<IWalletDetect> = ({ children, containerClassName }) => {
  const { address: account } = useAccount();
  const { t } = useTranslation();

  if (!account) {
    return (
      <div className={clsx(styles.container, containerClassName)}>
        <div className={styles.walletActionContainer}>
          <ConnectWalletCom />
        </div>
      </div>
    );
  }

  return <div className={styles.content}>{children}</div>;
};
