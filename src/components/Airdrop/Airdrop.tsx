// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { formatEther } from '@ethersproject/units';
import { Spinner, Tag, Typography } from '@subql/components';
import { AirdropClaimStatus, AirdropUser } from '@subql/network-query';
import { useGetAirdropsByAccountQuery } from '@subql/react-hooks';
import { Table, TableProps } from 'antd';
import { BigNumber } from 'ethers';
import i18next from 'i18next';
import moment from 'moment';
import { useAccount } from 'wagmi';

import { AIRDROP_CATEGORIES, DATE_FORMAT, TOKEN } from 'appConstants';
import { renderAsync } from 'utils/renderAsync';

import styles from './Airdrop.module.less';
import { AirdropAmountHeader } from './AirdropAmountHeader';
import { AirdropClaimButton } from './AirdropClaimButton';

enum AirdropRoundStatus {
  CLAIMED = 'CLAIMED',
  EXPIRED = 'EXPIRED',
  LOCKED = 'LOCKED',
  UNLOCKED = 'UNLOCKED'
}

interface SortedUserAirdrops extends AirdropUser {
  sortedStatus: AirdropRoundStatus;
  sortedNextMilestone: string;
}

const AirdropStatusTag: FC<{ status: AirdropRoundStatus }> = ({ status }) => {
  const statusMapping: { [key: string]: { color: 'success' | 'info' | 'default' | 'error'; text: string } } = {
    [AirdropRoundStatus.CLAIMED]: { color: 'success', text: i18next.t('airdrop.claimed') },
    [AirdropRoundStatus.UNLOCKED]: { color: 'info', text: i18next.t('airdrop.unlocked') },
    [AirdropRoundStatus.LOCKED]: { color: 'default', text: i18next.t('airdrop.locked') },
    [AirdropRoundStatus.EXPIRED]: { color: 'error', text: i18next.t('airdrop.expired') }
  };

  const { color, text } = statusMapping[status] || { color: 'default', text: 'unknown' };
  return <Tag color={color}>{text}</Tag>;
};

const getColumns = (t: any): TableProps<any>['columns'] => [
  {
    dataIndex: ['airdrop', 'id'],
    title: <Typography>{t('airdrop.category')}</Typography>,
    render: (airdropId: string) => <Typography>{AIRDROP_CATEGORIES[airdropId] ?? `Airdrop-${airdropId}`}</Typography>,
    width: '30%'
  },
  {
    dataIndex: 'amount',
    title: <Typography>{t('airdrop.amount')}</Typography>,
    render: (amount) => <Typography>{`${formatEther(amount)} ${TOKEN}`}</Typography>,
    align: 'right',
    width: '20%'
  },
  {
    dataIndex: 'sortedStatus',
    title: <Typography>{t('airdrop.status')}</Typography>,
    render: (airdropStatus) => <AirdropStatusTag status={airdropStatus} />,
    align: 'center',
    width: '15%'
  },
  {
    dataIndex: 'sortedNextMilestone',
    title: <Typography>{t('airdrop.nextMilestone')}</Typography>,
    render: (sortedNextMilestone) => <Typography>{sortedNextMilestone}</Typography>,
    width: '35%'
  }
];

/**
 * NOTE: NOT refer totalClaim from subql
 * REASON: Multi claimedEvent happen at same time when batchClaim function call, as the db table is not lock when insert
 *
 * @param userAirdrops
 * @returns [sortedAirdropArray for table, unlockedAirdropIds, unlockedAirdropAmount, claimedAirdropAmount]
 */

const sortUserAirdrops = (
  userAirdrops: Array<AirdropUser>
): [Array<SortedUserAirdrops>, Array<string>, BigNumber, BigNumber] => {
  const unlockedAirdropIds: Array<string> = [];
  let unlockedAirdropAmount = BigNumber.from('0');
  let claimedAirdropAmount = BigNumber.from('0');

  const sortedUserAirdrops = userAirdrops.map((userAirdrop) => {
    const { status, airdrop, amount } = userAirdrop;
    const hasUserClaimed = status === AirdropClaimStatus.CLAIMED;
    const startTime = moment.utc(airdrop?.startTime).local();
    const endTime = moment.utc(airdrop?.endTime).local();

    // Cal claimed amount
    if (hasUserClaimed) {
      claimedAirdropAmount = BigNumber.from(amount.toString()).add(claimedAirdropAmount);
    }

    // Before airdrop claim period
    const isAfterStartTime = startTime.isAfter();
    if (isAfterStartTime) {
      return {
        ...userAirdrop,
        sortedStatus: AirdropRoundStatus.LOCKED,
        sortedNextMilestone: i18next.t('airdrop.whenUnlock', { date: startTime.format(DATE_FORMAT) })
      };
    }

    // After airdrop claim period
    const isBeforeEndTime = endTime.isBefore();
    if (isBeforeEndTime) {
      const sortedStatus = hasUserClaimed ? AirdropRoundStatus.CLAIMED : AirdropRoundStatus.EXPIRED;
      const sortedNextMilestone = hasUserClaimed
        ? i18next.t('airdrop.youHvClaimed')
        : i18next.t('airdrop.whenExpired', { date: endTime.format(DATE_FORMAT) });

      return {
        ...userAirdrop,
        sortedStatus,
        sortedNextMilestone
      };
    }

    // moment().isBetween(startTime, endTime);
    if (!hasUserClaimed) {
      airdrop?.id && unlockedAirdropIds.push(airdrop?.id); // airdropId must exist
      unlockedAirdropAmount = BigNumber.from(amount.toString()).add(unlockedAirdropAmount);
    }
    const sortedStatus = hasUserClaimed ? AirdropRoundStatus.CLAIMED : AirdropRoundStatus.UNLOCKED;
    const sortedNextMilestone = hasUserClaimed
      ? i18next.t('airdrop.youHvClaimed')
      : i18next.t('airdrop.whenExpires', { date: endTime.format(DATE_FORMAT) });

    return {
      ...userAirdrop,
      sortedStatus,
      sortedNextMilestone
    };
  });

  return [sortedUserAirdrops, unlockedAirdropIds, unlockedAirdropAmount, claimedAirdropAmount];
};

export const Airdrop: FC = () => {
  const { t } = useTranslation();
  const { address: account } = useAccount();
  const accountAirdrop = useGetAirdropsByAccountQuery({
    variables: {
      account: account ?? ''
    }
  });

  return (
    <div className={styles.container}>
      {renderAsync(accountAirdrop, {
        loading: () => (
          <div style={{ minHeight: 500 }}>
            <Spinner />
          </div>
        ),
        error: (e) => (
          <div style={{ minHeight: 500 }}>
            <Typography style={{ color: 'var(--sq-error)' }}>{`Failed to get airdrop information. \n ${e}`}</Typography>
          </div>
        ),
        data: (data) => {
          if (!data) return null;
          const airdrops = data?.airdropUsers?.nodes as Array<AirdropUser>;
          const [sortedAirdrops, unlockedAirdropIds, unlockedAirdropAmount, claimedAirdropAmount] =
            sortUserAirdrops(airdrops);
          const { user } = sortedAirdrops[0] ?? {};

          return (
            <div className={styles.airdropClaimContainer}>
              <Typography className={styles.airdropClaimTitle}>{t('airdrop.claimTitle', { token: TOKEN })}</Typography>
              <Typography className={styles.description} type="secondary">
                {t('airdrop.description')}
              </Typography>
              <AirdropAmountHeader
                unlockedAirdropAmount={unlockedAirdropAmount}
                claimedAirdropAmount={claimedAirdropAmount}
              />

              {sortedAirdrops.length > 0 ? (
                <>
                  <Table
                    columns={getColumns(t)}
                    dataSource={[...sortedAirdrops]}
                    rowKey="id"
                    pagination={{ hideOnSinglePage: true }}
                  />
                  <AirdropClaimButton unlockedAirdropIds={unlockedAirdropIds} />
                </>
              ) : (
                <Typography type="secondary">{t('airdrop.nonToClaim')}</Typography>
              )}
            </div>
          );
        }
      })}
    </div>
  );
};
