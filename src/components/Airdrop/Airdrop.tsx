// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { VFC, FC } from 'react';
import i18next from 'i18next';
import { Button, Table, TableProps, Typography, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { formatEther } from '@ethersproject/units';
import styles from './Airdrop.module.css';
import { useWeb3 } from '../../containers';
import { useAirdropsByAccount } from '../../containers/QueryAirdrop';
import { GetAirdropsByAccount_airdropUsers_nodes as UserAirdrop } from '../../__generated__/airdropSubql/GetAirdropsByAccount';
import { AsyncData, renderAsync } from '../../utils/renderAsync';
import { AIRDROP_CATEGORIES, DATE_FORMAT, TOKEN } from '../../constants';
import { TableText } from '../Table';
import { TableTitle } from '../Table/TableTitle';
import { AirdropClaimStatus } from '../../__generated__/airdropSubql/globalTypes';

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

const sortUserAirdrops = (userAirdrops: Array<UserAirdrop>): Array<SortedUserAirdrops> => {
  const sortedUserAirdrops = userAirdrops.map((userAirdrop) => {
    const { status, airdrop } = userAirdrop;
    const hasUserClaimed = status === AirdropClaimStatus.CLAIMED;
    const startTime = moment(airdrop?.startTime);
    const endTime = moment(airdrop?.endTime);

    const isAfterStartTime = startTime.isAfter();
    if (isAfterStartTime) {
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

  return sortedUserAirdrops;
};

const AirdropList = ({ asyncData }: { asyncData: AsyncData<any> }) => {
  const { t } = useTranslation();
  return (
    <div>
      {renderAsync(asyncData, {
        error: (e) => (
          <Typography.Text type="danger">{`Error: Failed to get airdrop information. \n ${e}`}</Typography.Text>
        ),
        data: (data) => {
          if (!data) return null;
          const airdrops = data?.airdropUsers?.nodes;
          const sortedAirdrops = sortUserAirdrops(airdrops);

          return (
            <div className={styles.airdropClaimContainer}>
              <Typography.Title level={3} className={styles.airdropClaimTitle}>
                {t('airdrop.claimTitle', { token: TOKEN })}
              </Typography.Title>
              <Typography.Text className={styles.airdropClaimAmount}>Claim KSQT</Typography.Text>
              <Table
                columns={columns}
                dataSource={sortedAirdrops}
                rowKey="id"
                pagination={{ hideOnSinglePage: true }}
              />
              <Button type="ghost" shape="round" block disabled size="large" className={styles.claimedButton}>
                {t('airdrop.claimDateTBA')}
              </Button>
            </div>
          );
        }
      })}
    </div>
  );
};

export const Airdrop: VFC = () => {
  const { account } = useWeb3();
  const accountAirdrop = useAirdropsByAccount({ account: account ?? '' });
  return (
    <div className={styles.container}>
      <AirdropList asyncData={accountAirdrop} />
    </div>
  );
};
