// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useTranslation } from 'react-i18next';
import { networks } from '@subql/contract-sdk';
import { UnsupportedChainIdError } from '@web3-react/core';
import { Button, Typography } from 'antd';

import { ethMethods, SUPPORTED_NETWORK_CHAINID, useWeb3 } from 'containers';

import styles from './BlockchainStatus.module.css';

import 'i18n';

export const BlockchainStatus: React.FC = ({ children }) => {
  const { error } = useWeb3();
  const { t } = useTranslation();

  const isMetaMask = React.useMemo(() => !!window.ethereum?.isMetaMask, []);

  const handleSwitchNetwork = async () => {
    if (!window?.ethereum) return;

    try {
      await window.ethereum.request({
        method: ethMethods.switchChain,
        params: [{ chainId: `0x${Number(SUPPORTED_NETWORK_CHAINID).toString(16)}` }]
      });
    } catch (e: any) {
      console.log('e:', e);
      if (e?.code === 4902) {
        await window.ethereum.request({
          method: ethMethods.addChain,
          params: [networks.testnet]
        });
      } else {
        console.log('Switch Ethereum network failed', e);
      }
    }
  };

  if (error instanceof UnsupportedChainIdError) {
    return (
      <div className={styles.networkContainer}>
        <div className={styles.networkHint}>
          <Typography.Title level={2}>{t('unsupportedNetwork.title')}</Typography.Title>
          <Typography.Text className={styles.networkSubtitle}>{t('unsupportedNetwork.subtitle')}</Typography.Text>
          {isMetaMask && (
            <Button
              onClick={handleSwitchNetwork}
              shape="round"
              type="primary"
              size="large"
              className={styles.networkButton}
            >
              {t('unsupportedNetwork.button')}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
