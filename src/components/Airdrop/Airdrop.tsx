// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { VFC, FC } from 'react';
import i18next from 'i18next';
import { Button, Table, TableProps, Typography, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { formatEther } from '@ethersproject/units';
import { BigNumber, BigNumberish } from 'ethers';
import styles from './Airdrop.module.css';
import { useWeb3 } from '../../containers';
import { useAirdropsByAccount } from '../../containers/QueryAirdrop';
import { GetAirdropsByAccount_airdropUsers_nodes as UserAirdrop } from '../../__generated__/airdropSubql/GetAirdropsByAccount';
import { renderAsync } from '../../utils/renderAsync';
import { AIRDROP_CATEGORIES, DATE_FORMAT, TOKEN } from '../../constants';
import { TableText } from '../Table';
import { TableTitle } from '../Table/TableTitle';
import { AirdropClaimStatus } from '../../__generated__/airdropSubql/globalTypes';
import { formatAmount } from '../../utils';

export enum AirdropRoundStatus {
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

const columns: TableProps<SortedUserAirdrops>['columns'] = [
  {
    dataIndex: ['airdrop', 'id'],
    title: <TableTitle title={i18next.t('airdrop.category')} />,
    render: (airdropId: string) => <TableText>{AIRDROP_CATEGORIES[airdropId] ?? '-'}</TableText>
  },
  {
    dataIndex: 'amount',
    title: <TableTitle title={i18next.t('airdrop.amount')} />,
    render: (amount) => <TableText>{`${formatEther(amount)} ${TOKEN}`}</TableText>
  },
  {
    dataIndex: 'sortedStatus',
    title: <TableTitle title={i18next.t('airdrop.status')} />,
    render: (airdropStatus) => <AirdropStatusTag status={airdropStatus} />
  },
  {
    dataIndex: 'sortedNextMilestone',
    title: <TableTitle title={i18next.t('airdrop.nextMilestone')} />,
    width: '25%',
    render: (sortedNextMilestone) => <TableText>{sortedNextMilestone}</TableText>
  }
];

const sortUserAirdrops = (
  userAirdrops: Array<UserAirdrop>
): [Array<SortedUserAirdrops>, Array<string | undefined>, BigNumber] => {
  const unlockedAirdropIds: Array<string> = [];
  let unlockedAirdropAmount = BigNumber.from('0');
  const sortedUserAirdrops = userAirdrops.map((userAirdrop) => {
    const { status, airdrop, amount } = userAirdrop;
    const hasUserClaimed = status === AirdropClaimStatus.CLAIMED;
    const startTime = moment(airdrop?.startTime);
    const endTime = moment(airdrop?.endTime);

    const isAfterStartTime = startTime.isAfter();
    if (isAfterStartTime) {
      unlockedAirdropIds.push(airdrop?.id ?? '');
      unlockedAirdropAmount = BigNumber.from(amount.toString()).add(unlockedAirdropAmount);
      return {
        ...userAirdrop,
        sortedStatus: AirdropRoundStatus.LOCKED,
        sortedNextMilestone: `${startTime.format(DATE_FORMAT)} - ${endTime.format(DATE_FORMAT)}`
      };
    }
    const isBeforeEndTime = endTime.isBefore();
    if (isBeforeEndTime) {
      const sortedStatus = hasUserClaimed ? AirdropRoundStatus.CLAIMED : AirdropRoundStatus.EXPIRED;
      const sortedNextMilestone = hasUserClaimed ? '-' : i18next.t('airdrop.youMissed');

      return {
        ...userAirdrop,
        sortedStatus,
        sortedNextMilestone
      };
    }

    // moment().isBetween(startTime, endTime);
    const sortedStatus = hasUserClaimed ? AirdropRoundStatus.CLAIMED : AirdropRoundStatus.UNLOCKED;
    const sortedNextMilestone = hasUserClaimed
      ? '-'
      : `${startTime.format(DATE_FORMAT)} - ${endTime.format(DATE_FORMAT)}`;

    return {
      ...userAirdrop,
      sortedStatus,
      sortedNextMilestone
    };
  });

  return [sortedUserAirdrops, unlockedAirdropIds, unlockedAirdropAmount];
};

const AirdropAmountHeader = ({ airdropAmounts }: { airdropAmounts: Array<{ amount: BigNumberish; type: string }> }) => (
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

export const Airdrop: VFC = () => {
  const { t } = useTranslation();
  const { account } = useWeb3();
  const accountAirdrop = useAirdropsByAccount({ account: account ?? '' });
  return (
    <div className={styles.container}>
      {renderAsync(accountAirdrop, {
        error: (e) => (
          <Typography.Text type="danger">{`Error: Failed to get airdrop information. \n ${e}`}</Typography.Text>
        ),
        data: (data) => {
          if (!data) return null;
          const airdrops = data?.airdropUsers?.nodes as Array<UserAirdrop>;
          const [sortedAirdrops, unlockedAirdropIds, unlockedAirdropAmount] = sortUserAirdrops(airdrops);
          const { user } = sortedAirdrops[0] ?? {};
          const totalAirdropAmount = user?.totalAirdropAmount?.toString();
          const claimedAmount = user?.claimedAmount?.toString();

          return (
            <div className={styles.airdropClaimContainer}>
              <Typography.Title level={3} className={styles.airdropClaimTitle}>
                {t('airdrop.claimTitle', { token: TOKEN })}
              </Typography.Title>
              <AirdropAmountHeader
                airdropAmounts={[
                  { amount: totalAirdropAmount ?? '0', type: t('airdrop.total') },
                  { amount: claimedAmount ?? '0', type: t('airdrop.claimed') },
                  { amount: unlockedAirdropAmount ?? '0', type: t('airdrop.unlocked') }
                ]}
              />

              {sortedAirdrops.length > 0 && (
                <>
                  <Table
                    columns={columns}
                    dataSource={sortedAirdrops}
                    rowKey="id"
                    pagination={{ hideOnSinglePage: true }}
                  />
                  <Button type="ghost" shape="round" block disabled size="large" className={styles.claimedButton}>
                    {unlockedAirdropIds.length > 0 ? 'Claim the token' : 'There is no airdrop available to be claimed.'}
                  </Button>
                </>
              )}
            </div>
          );
        }
      })}
    </div>
  );
};
