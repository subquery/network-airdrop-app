// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import assert from 'assert';

import { useContracts } from 'hooks';
import { takeContractTx } from 'utils/takeContractTx';

import styles from './Airdrop.module.css';

export const AirdropClaimButton: React.FC<{
  unlockedAirdropIds: Array<string>;
}> = ({ unlockedAirdropIds }) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const { t } = useTranslation();
  const contracts = useContracts();

  console.log(contracts);

  const canClaim = unlockedAirdropIds.length > 0 && contracts;
  const buttonText = !contracts ? 'Loading contracts...' : canClaim ? t('airdrop.claim') : t('airdrop.nonToClaim');

  const onClick = async () => {
    assert(contracts, 'Contracts should be available.');
    setIsLoading(true);
    await takeContractTx({ contractTx: contracts.airdropper.batchClaimAirdrop(unlockedAirdropIds) });
    setIsLoading(false);
  };

  return (
    <Button
      type={canClaim ? 'primary' : 'ghost'}
      shape="round"
      block
      disabled={!canClaim}
      size="large"
      onClick={onClick}
      className={styles.claimedButton}
      loading={isLoading}
    >
      {buttonText}
    </Button>
  );
};
