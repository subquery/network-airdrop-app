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
      <Typography.Link active href="https://discord.com/invite/subquery" variant="medium">
        #seekers-support
      </Typography.Link>{' '}
      channel on our Discord
    </Typography>
  </div>
);

export const ConnectWalletCom: React.FC<{ mode?: 'challenge' | 'airdrop' }> = ({ mode }) => {
  const { t } = useTranslation();

  return (
    <div className={clsx(styles.container)}>
      {mode === 'challenge' ? (
        <>
          <Typography variant="h4" weight={600} style={{ textAlign: 'center' }}>
            Join SubQuery Seekers 50 Million SQT Challenge
          </Typography>
          <Typography variant="text" type="secondary" style={{ textAlign: 'center' }}>
            We are giving away 50 Million SQT to our most valued community members in the SubQuery Seekers Program.
            Simply register for the campaign, and start exploring the challenges. The more challenges you complete, the
            more SQT tokens you can earn!
          </Typography>
          <Typography type="secondary">The program closes on the 10th of April 2024 so be quick!</Typography>
        </>
      ) : (
        <>
          <Typography>
            To use the claim application, you need to connect your Ethereum wallet. If you don&apos;t have an Ethereum
            wallet, you can create one using Metamask, Talisman, RainbowWallet, or any other WalletConnect compatible
            wallet.
          </Typography>
        </>
      )}

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
  mode?: 'challenge' | 'airdrop';
}
export const WalletDetect: React.FC<IWalletDetect> = ({ children, containerClassName, mode = 'challenge' }) => {
  const { address: account } = useAccount();
  const { t } = useTranslation();

  if (!account) {
    return (
      <div className={clsx(styles.container, containerClassName)}>
        <div className={styles.walletActionContainer}>
          <ConnectWalletCom mode={mode} />
        </div>
      </div>
    );
  }

  return <div className={styles.content}>{children}</div>;
};
