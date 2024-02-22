import React from 'react';
import { Typography } from '@subql/components';
import { Button } from 'antd';
import { t } from 'i18next';
import { useNetwork, useSwitchNetwork } from 'wagmi';

export const BlockchainStatus: React.FC<{
  tipsChainIds: {
    id: number;
    name: string;
  };
}> = ({ children, tipsChainIds }) => {
  const { chain } = useNetwork();
  const { chains, switchNetwork } = useSwitchNetwork();

  if (tipsChainIds.id !== chain?.id) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--dark-mode-card)',
          borderRadius: 8,
          padding: 40,
          gap: 24,
          width: '100%'
        }}
      >
        <Typography variant="h4">{t('unsupportedNetwork.title')}</Typography>
        <Typography>{t('unsupportedNetwork.subtitle', { network: tipsChainIds.name })}</Typography>
        <Button
          onClick={() => {
            switchNetwork?.(tipsChainIds.id);
          }}
          type="primary"
          size="large"
          shape="round"
        >
          {t('unsupportedNetwork.button', { network: tipsChainIds.name })}
        </Button>
      </div>
    );
  }

  return <>{children}</>;
};
