// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Typography } from '@subql/components';
import { Button } from 'antd';
import { t } from 'i18next';
import { useNetwork, useSwitchNetwork } from 'wagmi';

export const BlockchainStatus: React.FC = ({ children }) => {
  const { chain } = useNetwork();
  const { chains, switchNetwork } = useSwitchNetwork();

  if (chain?.unsupported) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: 600,
          background: 'var(--dark-mode-card)',
          borderRadius: 8,
          padding: 40,
          gap: 24,
          margin: '0 auto'
        }}
      >
        <Typography variant="h4">{t('unsupportedNetwork.title')}</Typography>
        <Typography>{t('unsupportedNetwork.subtitle')}</Typography>
        <Button
          onClick={() => {
            switchNetwork?.(chains[0].id);
          }}
          type="primary"
          size="large"
          shape="round"
        >
          {t('unsupportedNetwork.button')}
        </Button>
      </div>
    );
  }

  return <>{children}</>;
};
