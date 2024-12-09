import React, { useMemo } from 'react';
import { Typography } from '@subql/components';
import { Button } from 'antd';
import { t } from 'i18next';
import { useNetwork, useSwitchNetwork } from 'wagmi';

import { useAccount } from 'hooks/useAccount';

export const BlockchainStatus: React.FC<{
  tipsChainIds: {
    id: number;
    name: string;
  }[];
}> = ({ children, tipsChainIds }) => {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const isUnsupportedNetwork = useMemo(() => {
    if (isConnected && !tipsChainIds.map((i) => i.id).includes(chain?.id as number)) {
      return true;
    }

    return false;
  }, [chain, tipsChainIds, isConnected]);

  if (isUnsupportedNetwork) {
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
        <Typography>{t('unsupportedNetwork.subtitle', { network: tipsChainIds[0].name })}</Typography>
        <Button
          onClick={() => {
            switchNetwork?.(tipsChainIds[0].id);
          }}
          type="primary"
          size="large"
          shape="round"
        >
          {t('unsupportedNetwork.button', { network: tipsChainIds[0].name })}
        </Button>
      </div>
    );
  }

  return <>{children}</>;
};
