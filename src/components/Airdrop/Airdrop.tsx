// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { VFC } from 'react';
import i18next from 'i18next';
import { Button, Table, TableProps, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import styles from './Airdrop.module.css';
import { useWeb3 } from '../../containers';
import { useAirdropsByAccount } from '../../containers/QueryAirdrop';
import { GetAirdropsByAccount_airdropUsers_nodes as userAirdrops } from '../../__generated__/airdropSubql/GetAirdropsByAccount';
import { AsyncData, renderAsync } from '../../utils/renderAsync';
import { AIRDROP_CATEGORIES } from '../../constants';
import { TableText } from '../Table';
import { TableTitle } from '../Table/TableTitle';

// TODO: update Status condition enum
// TODO: add Tag component
// TODO: add Next Milestone Col
const columns: TableProps<userAirdrops>['columns'] = [
  {
    dataIndex: ['airdrop', 'id'],
    title: <TableTitle title={i18next.t('airdrop.category')} />,
    render: (airdropId: string) => <TableText>{AIRDROP_CATEGORIES[airdropId] ?? '-'}</TableText>
  },
  {
    dataIndex: 'amount',
    title: <TableTitle title={i18next.t('airdrop.amount')} />,
    render: (amount: string) => <TableText>{amount}</TableText>
  },
  {
    dataIndex: 'status',
    title: <TableTitle title={i18next.t('airdrop.status')} />,
    render: (airdropId: string) => <TableText>Lock</TableText>
  },
  {
    dataIndex: ['airdrop', 'startTime'],
    title: <TableTitle title={i18next.t('airdrop.status')} />,
    render: (startTime, airdrop) => <TableText>{startTime}</TableText>
  }
];

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
          return (
            <div>
              <Typography.Text className={styles.airdropClaimAmount}>Claim KSQT</Typography.Text>
              <Table columns={columns} dataSource={airdrops} rowKey="id" pagination={{ hideOnSinglePage: true }} />
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
