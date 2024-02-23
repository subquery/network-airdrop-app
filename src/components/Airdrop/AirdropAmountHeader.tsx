import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@subql/components';
import clsx from 'clsx';
import { BigNumber } from 'ethers';
import { useAccount } from 'wagmi';

import { formatAmount } from 'utils';

import styles from './Airdrop.module.less';

export const AirdropAmountHeader: React.FC<{
  totalAllocatedAirdropAmount: BigNumber;
  unlockedAirdropAmount: BigNumber;
  claimedAirdropAmount: BigNumber;
}> = ({ totalAllocatedAirdropAmount, unlockedAirdropAmount, claimedAirdropAmount }) => {
  const { t } = useTranslation();
  const { address: account } = useAccount();

  const airdropAmounts = [
    { amount: totalAllocatedAirdropAmount, type: t('airdrop.total') },
    { amount: unlockedAirdropAmount, type: t('airdrop.unlockedTitle') },
    { amount: claimedAirdropAmount, type: t('airdrop.claimed') }
  ];

  return (
    <div className={styles.airdropClaimAmount}>
      {airdropAmounts.map((airdropAmount) => (
        <div key={airdropAmount.type} className={styles.amount}>
          <Typography className={clsx(styles.text, styles.amountTitle)}>{airdropAmount.type}</Typography>
          <Typography className={clsx(styles.text, styles.amountText)}>{formatAmount(airdropAmount.amount)}</Typography>
        </div>
      ))}
    </div>
  );
};
