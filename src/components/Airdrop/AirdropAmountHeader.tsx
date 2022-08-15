// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from 'antd';
import clsx from 'clsx';
import { BigNumber } from 'ethers';

import { GetAirdropsByAccount_airdropUsers_nodes_user as AirdropUser } from '__generated__/airdropSubql/GetAirdropsByAccount';
import { formatAmount } from 'utils';

import styles from './Airdrop.module.css';

export const AirdropAmountHeader: React.FC<{
  airdropUser: AirdropUser | null;
  unlockedAirdropAmount: BigNumber;
  claimedAirdropAmount: BigNumber;
}> = ({ airdropUser, unlockedAirdropAmount, claimedAirdropAmount }) => {
  const { t } = useTranslation();
  const totalAirdropAmount = airdropUser?.totalAirdropAmount?.toString() ?? '0';

  const airdropAmounts = [
    { amount: totalAirdropAmount, type: t('airdrop.total') },
    { amount: unlockedAirdropAmount, type: t('airdrop.unlockedTitle') },
    { amount: claimedAirdropAmount, type: t('airdrop.claimed') }
  ];

  return (
    <div className={styles.airdropClaimAmount}>
      {airdropAmounts.map((airdropAmount) => (
        <div key={airdropAmount.type} className={styles.amount}>
          <Typography.Text className={clsx(styles.text, styles.amountTitle)}>{airdropAmount.type}</Typography.Text>
          <Typography.Text className={clsx(styles.text, styles.amountText)}>
            {formatAmount(airdropAmount.amount)}
          </Typography.Text>
        </div>
      ))}
    </div>
  );
};
