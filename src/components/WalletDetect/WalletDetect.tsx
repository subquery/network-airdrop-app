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

type Mode = 'challenge' | 'airdrop' | 'delegationCampaign';

export const ContactUs: React.FC<{ mode?: Mode }> = ({ mode }) => (
  <div style={{ width: '100%', textAlign: 'center' }}>
    <Typography type="secondary">
      If you have any questions, contact us on the{' '}
      {mode === 'challenge' && (
        <Typography.Link type="info" href="https://discord.com/invite/subquery" variant="medium">
          #seekers-support
        </Typography.Link>
      )}
      {mode === 'delegationCampaign' && (
        <Typography.Link type="info" href="https://discord.com/invite/subquery">
          #delegation-campaign
        </Typography.Link>
      )}{' '}
      channel on our Discord
    </Typography>
  </div>
);

export const ConnectWalletCom: React.FC<{ mode?: Mode }> = ({ mode }) => {
  const { t } = useTranslation();

  return (
    <div className={clsx(styles.container)}>
      {mode === 'challenge' && (
        <>
          <Typography variant="h4" weight={600} style={{ textAlign: 'center' }}>
            Join SubQuery Seekers 50 Million SQT Challenge
          </Typography>
          <Typography variant="text" type="secondary" style={{ textAlign: 'center' }}>
            We are giving away 50 Million SQT to our most valued community members in the SubQuery Seekers Program.
            Simply register for the campaign, and start exploring the challenges. The more challenges you complete, the
            more SQT tokens you can earn!
          </Typography>
          <Typography type="secondary">The program closed on the 10th of April 2024!</Typography>
        </>
      )}
      {mode === 'airdrop' && (
        <>
          <Typography>
            To use the claim application, you need to connect your Ethereum wallet. If you don&apos;t have an Ethereum
            wallet, you can create one using Metamask, Talisman, RainbowWallet, or any other WalletConnect compatible
            wallet.
          </Typography>
        </>
      )}

      {mode === 'delegationCampaign' && (
        <>
          <Typography variant="h3" style={{ textAlign: 'center' }}>
            SubQuery Summer Delegation Frenzy
          </Typography>
          <Typography type="secondary" style={{ textAlign: 'center' }}>
            Welcome to the Summer Delegation Frenzy where we will be rewarding all Delegators on the SubQuery Network.
          </Typography>
          <Typography type="secondary" style={{ textAlign: 'center' }}>
            Whether your a seasoned pro, or brand new to the network, there’s points up for grabs and SQT to be earned!
          </Typography>
          <Typography type="secondary">Simply register for the campaign and start completing challenges.</Typography>
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

      <ContactUs mode={mode}></ContactUs>
    </div>
  );
};

interface IWalletDetect {
  containerClassName?: string;
  mode?: Mode;
  style?: React.CSSProperties;
}
export const WalletDetect: React.FC<IWalletDetect> = ({ children, style, containerClassName, mode = 'challenge' }) => {
  const { address: account } = useAccount();
  const { t } = useTranslation();

  if (!account) {
    return (
      <div className={clsx(styles.container, containerClassName)} style={style}>
        <div className={styles.walletActionContainer}>
          <ConnectWalletCom mode={mode} />
        </div>
      </div>
    );
  }

  return <div className={styles.content}>{children}</div>;
};
