// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { formatEther } from '@ethersproject/units';
import { Table, TableProps, Tag, Typography } from 'antd';
import { BigNumber } from 'ethers';
import i18next from 'i18next';
import moment from 'moment';

import { GetAirdropsByAccount_airdropUsers_nodes as UserAirdrop } from '__generated__/airdropSubql/GetAirdropsByAccount';
import { AirdropClaimStatus } from '__generated__/airdropSubql/globalTypes';
import { AIRDROP_CATEGORIES, DATE_FORMAT, TOKEN } from 'appConstants';
import { useWeb3 } from 'containers';
import { useAirdropsByAccount } from 'containers/QueryAirdrop';
import { renderAsync } from 'utils/renderAsync';

import { TableText } from '../Table';
import { TableTitle } from '../Table/TableTitle';
import styles from './Airdrop.module.css';
import { AirdropAmountHeader } from './AirdropAmountHeader';
import { AirdropClaimButton } from './AirdropClaimButton';

enum AirdropRoundStatus {
  CLAIMED = 'CLAIMED',
  EXPIRED = 'EXPIRED',
  LOCKED = 'LOCKED',
  UNLOCKED = 'UNLOCKED'
}

interface SortedUserAirdrops extends UserAirdrop {
  sortedStatus: AirdropRoundStatus;
  sortedNextMilestone: string;
}

const AirdropStatusTag: FC<{ status: AirdropRoundStatus }> = ({ status }) => {
  const statusMapping: { [key: string]: { color: string; text: string } } = {
    [AirdropRoundStatus.CLAIMED]: { color: 'success', text: i18next.t('airdrop.claimed') },
    [AirdropRoundStatus.UNLOCKED]: { color: 'processing', text: i18next.t('airdrop.unlocked') },
    [AirdropRoundStatus.LOCKED]: { color: 'default', text: i18next.t('airdrop.locked') },
    [AirdropRoundStatus.EXPIRED]: { color: 'error', text: i18next.t('airdrop.expired') }
  };

  const { color, text } = statusMapping[status] || { color: 'default', text: 'unknown' };
  return <Tag color={color}>{text}</Tag>;
};

const getColumns = (t: any): TableProps<SortedUserAirdrops>['columns'] => [
  {
    dataIndex: ['airdrop', 'id'],
    title: <TableTitle title={t('airdrop.category')} />,
    render: (airdropId: string) => <TableText>{AIRDROP_CATEGORIES[airdropId] ?? `Airdrop-${airdropId}`}</TableText>,
    width: '30%'
  },
  {
    dataIndex: 'amount',
    title: <TableTitle title={t('airdrop.amount')} />,
    render: (amount) => <TableText>{`${formatEther(amount)} ${TOKEN}`}</TableText>,
    align: 'right',
    width: '20%'
  },
  {
    dataIndex: 'sortedStatus',
    title: <TableTitle title={t('airdrop.status')} />,
    render: (airdropStatus) => <AirdropStatusTag status={airdropStatus} />,
    align: 'center',
    width: '15%'
  },
  {
    dataIndex: 'sortedNextMilestone',
    title: <TableTitle title={t('airdrop.nextMilestone')} />,
    render: (sortedNextMilestone) => <TableText>{sortedNextMilestone}</TableText>,
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
  userAirdrops: Array<UserAirdrop>
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

export const Airdrop: VFC = () => {
  const { t } = useTranslation();
  const { account } = useWeb3();
  const accountAirdrop = useAirdropsByAccount({ account: account ?? '' });
  return (
    <div className={styles.container}>
      {renderAsync(accountAirdrop, {
        error: (e) => <Typography.Text type="danger">{`Failed to get airdrop information. \n ${e}`}</Typography.Text>,
        data: (data) => {
          if (!data) return null;
          const airdrops = data?.airdropUsers?.nodes as Array<UserAirdrop>;
          const [sortedAirdrops, unlockedAirdropIds, unlockedAirdropAmount, claimedAirdropAmount] =
            sortUserAirdrops(airdrops);
          const { user } = sortedAirdrops[0] ?? {};

          return (
            <div className={styles.airdropClaimContainer}>
              <Typography.Title level={3} className={styles.airdropClaimTitle}>
                {t('airdrop.claimTitle', { token: TOKEN })}
              </Typography.Title>
              <Typography.Text className={styles.description}>{t('airdrop.description')}</Typography.Text>
              <AirdropAmountHeader
                airdropUser={user}
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
                <Typography.Text>{t('airdrop.nonToClaim')}</Typography.Text>
              )}
            </div>
          );
        }
      })}
    </div>
  );
};
