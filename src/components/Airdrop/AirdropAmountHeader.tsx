// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useGetAirdropClaimsQuery } from '@subql/react-hooks';
import { Typography } from 'antd';
import clsx from 'clsx';
import { BigNumber } from 'ethers';

import { useWeb3 } from 'containers';
import { formatAmount } from 'utils';

import styles from './Airdrop.module.css';

export const AirdropAmountHeader: React.FC<{
  unlockedAirdropAmount: BigNumber;
  claimedAirdropAmount: BigNumber;
}> = ({ unlockedAirdropAmount, claimedAirdropAmount }) => {
  const { t } = useTranslation();
  const { account } = useWeb3();

  const airdropClaims = useGetAirdropClaimsQuery({
    variables: {
      account: account || ''
    }
  });

  // @ts-ignore
  // const totalAirdropAmount = airdropUser?.totalAirdropAmount?.toString() ?? '0';
  // const totalAirdropAmount = '0';
  const airdropAmounts = [
    { amount: airdropClaims.data?.airdropAmount?.totalAirdropAmount || '0', type: t('airdrop.total') },
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
