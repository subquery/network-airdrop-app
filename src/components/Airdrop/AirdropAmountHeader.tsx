// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { BigNumber } from 'ethers';
import { formatAmount } from 'utils';
import styles from './Airdrop.module.css';
import {
  GetAirdropsByAccount_airdropUsers_nodes as UserAirdrop,
  GetAirdropsByAccount_airdropUsers_nodes_user as AirdropUser
} from '../../__generated__/airdropSubql/GetAirdropsByAccount';

export const AirdropAmountHeader: React.FC<{
  airdropUser: AirdropUser | null;
  unlockedAirdropAmount: BigNumber;
}> = ({ airdropUser, unlockedAirdropAmount }) => {
  const { t } = useTranslation();
  const totalAirdropAmount = airdropUser?.totalAirdropAmount?.toString() ?? '0';
  const claimedAmount = airdropUser?.claimedAmount?.toString() ?? '0';

  const airdropAmounts = [
    { amount: totalAirdropAmount, type: t('airdrop.total') },
    { amount: claimedAmount, type: t('airdrop.claimed') },
    { amount: unlockedAirdropAmount, type: t('airdrop.unlocked') }
  ];

  return (
    <div className={styles.airdropClaimAmount}>
      {airdropAmounts.map((airdropAmount) => (
        <div key={airdropAmount.type} className={styles.amount}>
          <Typography.Title level={5} className={styles.amountText}>
            {airdropAmount.type}
          </Typography.Title>
          <Typography.Text className={styles.amountText}>{formatAmount(airdropAmount.amount)}</Typography.Text>
        </div>
      ))}
    </div>
  );
};
