/* eslint-disable no-await-in-loop */
import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { formatEther } from '@ethersproject/units';
import { openNotification, Spinner, Tag, Typography } from '@subql/components';
import { RootContractSDK } from '@subql/contract-sdk';
import { SQNetworks } from '@subql/network-config';
import { renderAsyncArray } from '@subql/react-hooks';
import { formatSQT, mergeAsync } from '@subql/react-hooks/dist/utils';
import { useMount } from 'ahooks';
import { Button, Table, TableProps } from 'antd';
import { airdropRoundMapping } from 'conf/airdropRoundMapping';
import { BigNumber } from 'ethers';
import i18next from 'i18next';
import { uniqWith } from 'lodash-es';
import moment from 'moment';
import { mainnet, sepolia, useAccount, usePublicClient } from 'wagmi';

import { DATE_FORMAT, TOKEN } from 'appConstants';
import { GIFT } from 'containers';
import { publicClientToProvider, useContracts } from 'hooks';
import { useIpfs } from 'hooks/useIpfs';
import { mapContractError } from 'utils';

import styles from './Airdrop.module.less';
import { AirdropAmountHeader } from './AirdropAmountHeader';
import { AirdropClaimButton } from './AirdropClaimButton';

enum AirdropRoundStatus {
  CLAIMED = 'CLAIMED',
  UNCLAIMED = 'UNCLAIMED',
  EXPIRED = 'EXPIRED',
  LOCKED = 'LOCKED',
  UNLOCKED = 'UNLOCKED',
  REDEEMED = 'REDEEMED',
  INPROGRESS = 'INPROGRESS'
}

export interface tableItem {
  id: ReactNode;
  sortedStatus: AirdropRoundStatus;
  sortedNextMilestone: ReactNode;
  amountString: ReactNode;
}

export interface IUnclaimedGifts {
  userUnclaimedNfts: {
    nodes: {
      amount: string;
      seriesId: string;
      id: string;
      series: {
        active: boolean;
        tokenURI: string;
      };
    }[];
  };
}

export interface IClaimedGifts {
  userNfts: {
    nodes: {
      id: string;
      address: string;
      seriesId: string;
      series: {
        active: boolean;
        tokenURI: string;
      };
    }[];

    groupedAggregates: {
      keys: [string, string];
      distinctCount: {
        id: string;
      };
    }[];
  };
}

export interface IRedeemedGifts {
  userRedeemedNfts: {
    nodes: {
      id: string;
      tokenId: string;
      seriesId: string;
      series: {
        active: boolean;
        tokenURI: string;
      };
      address: string;
      amount: string;
    }[];

    groupedAggregates: {
      keys: [string, string];
      distinctCount: {
        id: string;
      };
    }[];
  };
}

export type NftIpfs = {
  [key: string]: {
    name: string;
    description: string;
    external_url: string;
    image: string;
  };
};

export interface IAccountAirdrop {
  airdropUsers: {
    totalCount?: number;
    nodes: {
      id: string;
      user: string;
      airdrop: {
        id: string;
        tokenAddress: string;
        startTime: Date;
        endTime: Date;
      };
      amount: string;
      status: AirdropRoundStatus.CLAIMED | AirdropRoundStatus.UNCLAIMED;
    }[];
  };
}

type SortedUserAirdrops = Omit<IAccountAirdrop['airdropUsers']['nodes'][number], 'id'> & {
  sortedStatus: AirdropRoundStatus;
  sortedNextMilestone: string;
  id: ReactNode;
  amountString: ReactNode;
  key: string;
};

const AirdropStatusTag: FC<{ status: AirdropRoundStatus }> = ({ status }) => {
  const statusMapping: { [key: string]: { color: 'success' | 'info' | 'default' | 'error'; text: string } } = {
    [AirdropRoundStatus.CLAIMED]: { color: 'success', text: i18next.t('airdrop.claimed') },
    [AirdropRoundStatus.UNLOCKED]: { color: 'info', text: i18next.t('airdrop.unlocked') },
    [AirdropRoundStatus.LOCKED]: { color: 'default', text: i18next.t('airdrop.locked') },
    [AirdropRoundStatus.EXPIRED]: { color: 'error', text: i18next.t('airdrop.expired') },
    [AirdropRoundStatus.REDEEMED]: { color: 'success', text: i18next.t('airdrop.redeemed') },
    [AirdropRoundStatus.INPROGRESS]: { color: 'info', text: 'In Progress' }
  };

  const { color, text } = statusMapping[status] || { color: 'default', text: 'unknown' };
  return <Tag color={color}>{text}</Tag>;
};

const getColumns = (t: any): TableProps<any>['columns'] => [
  {
    dataIndex: 'id',
    title: <Typography>{t('airdrop.category')}</Typography>,
    render: (airdropId: string) => airdropId,
    width: '30%'
  },
  {
    dataIndex: 'amountString',
    title: <Typography>{t('airdrop.amount')}</Typography>,
    render: (amount) => <Typography>{amount}</Typography>,
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

const useGetAirdropRecordsOnL1 = () => {
  const { address: account } = useAccount();

  const publicClient = usePublicClient({
    chainId: process.env.REACT_APP_NETWORK === 'testnet' ? sepolia.id : mainnet.id
  });
  const provider = useMemo(() => publicClientToProvider(publicClient), [publicClient]);
  const rootContract = useMemo(
    () =>
      RootContractSDK.create(provider, {
        network: process.env.REACT_APP_NETWORK as SQNetworks
      }),
    [provider]
  );

  const [airdropRecords, setAirdropRecords] = useState<
    {
      id: ReactNode;
      amountString: ReactNode;
      sortedNextMilestone: ReactNode;
      key: string;
      sortedStatus: AirdropRoundStatus;
      roundId: number;
      amount: string;
    }[]
  >([]);

  const [loading, setLoading] = useState(false);

  const getAirdropRecords = async () => {
    if (!rootContract || !account) return;
    try {
      setLoading(true);
      // only round 0 need fetch from L1
      const roundId = 0;
      const accountAirdropInfo = await rootContract.airdropperLite.airdropRecord(account, roundId);
      if (accountAirdropInfo.eq(0)) return;
      const roundInfo = await rootContract.airdropperLite.roundRecord(roundId);

      const unlock =
        +moment() >=
        +moment(+`${roundInfo.roundStartTime}000`)
          .utc(true)
          .local();
      const expired =
        +moment() >=
        +moment(+`${roundInfo.roundDeadline}000`)
          .utc(true)
          .local();
      const unclaimedTokens = formatSQT(accountAirdropInfo.toString());
      const unlockDate = moment(+`${roundInfo.roundStartTime}000`)
        .utc(true)
        .local()
        .format('YYYY-MM-DD HH:mm:ss');

      setAirdropRecords([
        {
          id: <Typography>{airdropRoundMapping[roundId] || `Airdrop Rounding ${roundId}`}</Typography>,
          amountString: (
            <Typography>
              {unclaimedTokens} {TOKEN}
            </Typography>
          ),
          key: `airdropL1${roundId}`,
          sortedStatus: expired
            ? AirdropRoundStatus.EXPIRED
            : unlock
            ? AirdropRoundStatus.UNLOCKED
            : AirdropRoundStatus.LOCKED,
          sortedNextMilestone: expired ? 'Expired' : unlock ? 'Ready to Claim' : `Unlock Date: ${unlockDate}`,
          roundId,
          amount: accountAirdropInfo.toString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setAirdropRecords([]);
    getAirdropRecords();
  }, [account, rootContract]);

  return {
    airdropRecords,
    loading,
    refresh: () => {
      setAirdropRecords([]);
      getAirdropRecords();
    }
  };
};

export const Airdrop: FC = () => {
  const { t } = useTranslation();
  const { address: account } = useAccount();
  const { catSingle } = useIpfs();
  const contracts = useContracts();

  const [nftSerices, setNftSerices] = useState<NftIpfs>({});
  const [redeemLoading, setRedeemLoading] = useState<boolean>(false);
  const [redeemable, setRedeemable] = useState<boolean>(false);

  const { loading: l1Loading, airdropRecords: l1AirdropRecords, refresh: l1Refresh } = useGetAirdropRecordsOnL1();

  const [currentUserPublicSaleResult, setCurrentUserPublicSaleResult] = useState<
    {
      category: string;
      amount: number;
      unlock: string;
    }[]
  >([]);

  const accountUnclaimGifts = useQuery<IUnclaimedGifts>(
    gql`
      query ($address: String!) {
        userUnclaimedNfts(filter: { address: { equalTo: $address } }) {
          nodes {
            id
            amount
            seriesId
            series {
              active
              tokenURI
            }
          }
        }
      }
    `,
    {
      variables: {
        address: account
      },
      fetchPolicy: 'network-only',
      context: {
        clientName: GIFT
      },
      pollInterval: 15000
    }
  );

  const accountClaimedGifts = useQuery<IClaimedGifts>(
    gql`
      query ($address: String!) {
        userNfts(filter: { address: { equalTo: $address } }) {
          nodes {
            id
            address
            seriesId
            series {
              active
              tokenURI
            }
          }

          groupedAggregates(groupBy: [ADDRESS, SERIES_ID]) {
            keys
            distinctCount {
              id
            }
          }
        }
      }
    `,
    {
      variables: {
        address: account
      },
      fetchPolicy: 'network-only',
      context: {
        clientName: GIFT
      },
      pollInterval: 15000
    }
  );

  const accountAirdrop = useQuery<IAccountAirdrop>(
    gql`
      query GetAirdropsByAccount($account: String!) {
        airdropUsers(filter: { user: { equalTo: $account } }) {
          totalCount
          nodes {
            id
            user
            airdrop {
              id
              tokenAddress
              startTime
              endTime
            }
            amount
            status
          }
        }
      }
    `,
    {
      variables: {
        account: account ?? ''
      },
      fetchPolicy: 'network-only',
      pollInterval: 15000
    }
  );

  const sortUserAirdrops = useMemo<[Array<SortedUserAirdrops>, Array<string>, BigNumber, BigNumber]>(() => {
    const unlockedAirdropIds: Array<string> = [];
    let unlockedAirdropAmount = BigNumber.from('0');
    let claimedAirdropAmount = BigNumber.from('0');
    const userAirdrops = accountAirdrop.data?.airdropUsers.nodes || [];

    const sortedUserAirdrops = userAirdrops.map((userAirdrop) => {
      const { status, airdrop, amount } = userAirdrop;
      const hasUserClaimed = status === AirdropRoundStatus.CLAIMED;
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
          id: <Typography>{airdropRoundMapping[airdrop.id] || `Airdrop Rounding ${airdrop.id}`}</Typography>,
          amountString: (
            <Typography>
              {formatSQT(userAirdrop.amount)} {TOKEN}
            </Typography>
          ),
          sortedStatus: AirdropRoundStatus.LOCKED,
          sortedNextMilestone: i18next.t('airdrop.whenUnlock', { date: startTime.format(DATE_FORMAT) }),
          key: `airdrop${airdrop.id}`
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
          id: <Typography>{airdropRoundMapping[airdrop.id] || `Airdrop Rounding ${airdrop.id}`}</Typography>,
          amountString: (
            <Typography>
              {formatSQT(userAirdrop.amount)} {TOKEN}
            </Typography>
          ),
          sortedStatus,
          sortedNextMilestone,
          key: `airdrop${airdrop.id}`
        };
      }

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
        id: <Typography>{airdropRoundMapping[airdrop.id] || `Airdrop Rounding ${airdrop.id}`}</Typography>,
        amountString: (
          <Typography>
            {formatSQT(userAirdrop.amount)} {TOKEN}
          </Typography>
        ),
        sortedStatus,
        sortedNextMilestone,
        key: `airdrop${airdrop.id}`
      };
    });

    return [sortedUserAirdrops, unlockedAirdropIds, unlockedAirdropAmount, claimedAirdropAmount];
  }, [accountAirdrop.data]);

  const [getAccountRedeemedGifts, accountRedeemedGifts] = useLazyQuery<IRedeemedGifts>(
    gql`
      query ($address: String!) {
        userRedeemedNfts(filter: { address: { equalTo: $address } }) {
          nodes {
            id
            tokenId
            seriesId
            amount
            address
            series {
              tokenURI
              active
              id
            }
          }
          groupedAggregates(groupBy: [ADDRESS, SERIES_ID]) {
            keys
            distinctCount {
              id
            }
          }
        }
      }
    `,
    {
      variables: {
        address: account
      },
      fetchPolicy: 'network-only',
      context: {
        clientName: GIFT
      },
      pollInterval: 15000
    }
  );

  const getPublicSaleResult = async () => {
    if (!account) return;

    try {
      const res = await fetch(`https://sq-airdrop-backend.subquery.network/public-sale/token-claim/${account}`);

      if (res.status === 200) {
        const json = await res.json();

        setCurrentUserPublicSaleResult(json);
      }
    } catch (e) {
      // don't care about this
    }
  };

  const getRedeemable = async () => {
    try {
      const fetchedRedeemable = await contracts?.sqtRedeem.redeemable();
      setRedeemable(fetchedRedeemable || false);
    } catch (e) {
      // don't care about this
    }
  };

  const redeemNft = async (nfts: IClaimedGifts['userNfts']['nodes']) => {
    if (!contracts) return;
    try {
      setRedeemLoading(true);
      // const nftAddress = new Array(nfts.length).fill(contracts?.sqtGift.address);
      // const tokenIds = nfts.map((nft) => nft.id);
      // eslint-disable-next-line no-restricted-syntax
      for (const nft of nfts) {
        const nftName = nftSerices[nft.series.tokenURI]?.name
          ? `${nftSerices[nft.series.tokenURI]?.name}-${nft.id}`
          : nft.id;

        const approved = await contracts.sqtGift.getApproved(nft.id);
        if (!approved) {
          openNotification({
            type: 'info',
            description: `Before you redeem NFT ${nftName}, you need to approve the contract to spend your NFT`
          });
          const approve = await contracts.sqtGift.approve(contracts.sqtRedeem.address, nft.id);
          await approve?.wait();
        }
        const tx = await contracts?.sqtRedeem.redeem(contracts.sqtGift.address, nft.id);
        const receipt = await tx?.wait();

        if (receipt) {
          openNotification({
            type: 'success',
            description: `Redeem NFT ${nftName} success`,
            duration: 3
          });
        }
      }
    } catch (e: any) {
      console.error(e);
      openNotification({
        type: 'error',
        description: `Redeem NFT failed, ${mapContractError(e) ?? e.message ?? ''}`,
        duration: 3
      });
    } finally {
      setRedeemLoading(false);
    }
  };

  const getNftSericesNames = async () => {
    const tokenCids = [
      ...new Set(
        accountUnclaimGifts.data?.userUnclaimedNfts.nodes
          .map((i) => i.series.tokenURI)
          .concat(accountClaimedGifts.data?.userNfts.nodes.map((i) => i.series.tokenURI) || []) || []
      )
    ];

    const res = await Promise.allSettled(tokenCids.map((cid) => catSingle(cid)));

    const nftSericesInfos = res.reduce((cur, add, index) => {
      if (add.status === 'fulfilled') {
        // eslint-disable-next-line no-param-reassign
        cur[tokenCids[index]] = JSON.parse(Buffer.from(add.value).toString('utf8'));
      }

      return cur;
    }, {} as NftIpfs);

    setNftSerices(nftSericesInfos);
  };

  const sortGifts = (
    userUnClaimGifts: IUnclaimedGifts,
    claimedGiftsData: IClaimedGifts,
    redeemedGifts: IRedeemedGifts
  ): tableItem[] => {
    const {
      userUnclaimedNfts: { nodes }
    } = userUnClaimGifts;

    const {
      userNfts: { nodes: claimedNfts, groupedAggregates }
    } = claimedGiftsData;

    const {
      userRedeemedNfts: { nodes: redeemedNfts, groupedAggregates: redeemedGroupedAggregates }
    } = redeemedGifts;

    const sortedRedeemedNfts = uniqWith(
      redeemedNfts,
      (a, b) => `${a.address}-${a.series.tokenURI}` === `${b.address}-${b.series.tokenURI}`
    ).map((i, index) => {
      const findAmount =
        redeemedGroupedAggregates.find((g) => g.keys.join('-') === `${i.address}-${i.seriesId}`)?.distinctCount.id ||
        '1';

      return {
        id: <Typography>{nftSerices[i.series.tokenURI]?.name || `NFT-${index}`}</Typography>,
        sortedStatus: AirdropRoundStatus.REDEEMED,
        sortedNextMilestone: 'View in Wallet',
        amountString: `${formatEther(BigNumber.from(i.amount).mul(findAmount))} SQT`,
        key: `${i.address}${i.id}redeem`,
        // those fields are used to filter by claimed
        uniKey: `${i.address}${i.seriesId}`,
        count: findAmount
      };
    });

    const sortedClaimedNfts = uniqWith(
      claimedNfts,
      (a, b) => `${a.address}-${a.series.tokenURI}` === `${b.address}-${b.series.tokenURI}`
    )
      .map((i, index) => {
        const findAmount =
          groupedAggregates.find((g) => g.keys.join('-') === `${i.address}-${i.seriesId}`)?.distinctCount.id || '1';

        const uniKey = `${i.address}${i.seriesId}`;

        const renderAmount = +findAmount - +(sortedRedeemedNfts.find((ii) => ii.uniKey === uniKey)?.count || 0);

        return {
          id: <Typography>{nftSerices[i.series.tokenURI]?.name || `NFT-${index}`}</Typography>,
          sortedStatus: AirdropRoundStatus.CLAIMED,
          sortedNextMilestone: (
            <div style={{ display: 'flex', gap: 8 }}>
              <Typography.Link active href="https://opensea.io/">
                View in OpenSea
              </Typography.Link>
            </div>
          ),
          amountString: `${renderAmount} NFT`,
          key: `${i.address}${i.id}unclaim`,
          count: renderAmount
        };
      })
      .filter((i) => i.count > 0);

    const sortedUnClaimedNfts = nodes.map((i, index) => ({
      id: <Typography>{nftSerices[i.series.tokenURI]?.name || `NFT-${index}`}</Typography>,
      sortedStatus: i.series.active ? AirdropRoundStatus.UNLOCKED : AirdropRoundStatus.EXPIRED,
      sortedNextMilestone: i.series.active ? 'Ready to Claim' : 'Expired',
      amountString: `${i.amount} NFT`,
      key: `${i.seriesId}${i.id}claim`
    }));

    return [...sortedUnClaimedNfts, ...sortedClaimedNfts, ...sortedRedeemedNfts];
  };

  useEffect(() => {
    if (!accountClaimedGifts.loading && !accountUnclaimGifts.loading) {
      getNftSericesNames();
    }
  }, [accountUnclaimGifts.data?.userUnclaimedNfts, accountClaimedGifts.data]);

  useEffect(() => {
    if (redeemable) {
      getAccountRedeemedGifts();
    }
  }, [redeemable]);

  useEffect(() => {
    getPublicSaleResult();
  }, [account]);

  useMount(() => {
    getRedeemable();
  });

  return (
    <div className={styles.container}>
      {renderAsyncArray(
        mergeAsync(
          accountUnclaimGifts,
          accountClaimedGifts,
          redeemable ? accountRedeemedGifts : { loading: false },
          accountAirdrop
        ),
        {
          empty: () => (
            <div style={{ minHeight: 500 }}>
              <Typography style={{ color: 'var(--sq-error)' }}>Failed to get airdrop information.</Typography>
            </div>
          ),
          loading: () => (
            <div style={{ minHeight: 500, display: 'flex', justifyContent: 'center' }}>
              <Spinner />
            </div>
          ),
          error: (e) => (
            <div style={{ minHeight: 500 }}>
              <Typography
                style={{ color: 'var(--sq-error)' }}
              >{`Failed to get airdrop information. \n ${e}`}</Typography>
            </div>
          ),
          data: (data) => {
            if (l1Loading)
              return (
                <div style={{ minHeight: 500, display: 'flex', justifyContent: 'center' }}>
                  <Spinner />
                </div>
              );
            if (!data) return null;
            const [unClaimGifts, userNfts, redeemedNfts, airdropUsers] = data;
            const redeemNftsTokenIds = redeemedNfts?.userRedeemedNfts.nodes.map((i) => i.tokenId) || [];
            const [sortedAirdrops, unlockedAirdropIds, unlockedAirdropAmount, claimedAirdropAmount] = sortUserAirdrops;
            const totalAllocations = airdropUsers?.airdropUsers.nodes.reduce(
              (cur, add) => cur.add(add.amount),
              BigNumber.from('0')
            );
            const renderTable = [
              ...sortGifts(
                unClaimGifts || { userUnclaimedNfts: { nodes: [] } },
                userNfts || { userNfts: { nodes: [], groupedAggregates: [] } },
                redeemedNfts || { userRedeemedNfts: { nodes: [], groupedAggregates: [] } }
              ),

              ...l1AirdropRecords,
              // ...currentUserPublicSaleResult.map((i, index) => ({
              //   id: <Typography>{i.category}</Typography>,
              //   sortedStatus:
              //     +moment() >= +moment(i.unlock).utc(true).local()
              //       ? AirdropRoundStatus.INPROGRESS
              //       : AirdropRoundStatus.LOCKED,
              //   sortedNextMilestone: `Unlock date: ${
              //     i.unlock !== '' ? moment(i.unlock).utc(true).local().format('YYYY-MM-DD HH:mm:ss') : '-'
              //   }`,
              //   amountString: `${i.amount} SQT`,
              //   key: `publicSale${index}`
              // })),
              ...sortedAirdrops
            ];

            const unlockSeriesIds = unClaimGifts?.userUnclaimedNfts.nodes.map((i) => i.seriesId) || [];
            const canRedeemNfts = userNfts?.userNfts.nodes.filter((i) => !redeemNftsTokenIds.includes(i.id)) || [];

            const totalFromL1 = l1AirdropRecords.reduce((cur, add) => cur.add(add.amount), BigNumber.from('0'));
            const totalUnlockFromL1 = l1AirdropRecords
              .filter((i) => i.sortedStatus === AirdropRoundStatus.UNLOCKED)
              .reduce((cur, add) => cur.add(add.amount), BigNumber.from('0'));

            return (
              <div className={styles.airdropClaimContainer}>
                <Typography variant="h6">{t('airdrop.claimTitle', { token: TOKEN })}</Typography>
                <br />
                <Typography style={{ marginTop: 8 }} type="secondary">
                  {t('airdrop.description')}
                </Typography>
                <AirdropAmountHeader
                  totalAllocatedAirdropAmount={(totalAllocations || BigNumber.from('0')).add(totalFromL1)}
                  unlockedAirdropAmount={unlockedAirdropAmount.add(totalUnlockFromL1)}
                  claimedAirdropAmount={claimedAirdropAmount}
                />

                {renderTable.length > 0 ? (
                  <>
                    <Table
                      className={styles.darkTable}
                      columns={getColumns(t)}
                      dataSource={renderTable}
                      pagination={{ hideOnSinglePage: true }}
                      rowKey="key"
                    />
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 8 }}>
                      {redeemable && (
                        <Button
                          type="primary"
                          ghost
                          shape="round"
                          size="large"
                          style={{ flex: 1 }}
                          disabled={!canRedeemNfts.length}
                          loading={redeemLoading}
                          onClick={async () => {
                            await redeemNft(canRedeemNfts);
                            accountRedeemedGifts.refetch();
                          }}
                        >
                          Redeem All NFT
                        </Button>
                      )}
                      <AirdropClaimButton
                        l1AirdropIds={l1AirdropRecords
                          .filter((i) => i.sortedStatus === AirdropRoundStatus.UNLOCKED)
                          .map((i) => i.roundId)}
                        unlockSeriesIds={unlockSeriesIds}
                        unlockedAirdropIds={unlockedAirdropIds}
                        onSuccessL1={() => {
                          l1Refresh();
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <Typography type="secondary">{t('airdrop.nonToClaim')}</Typography>
                )}
              </div>
            );
          }
        }
      )}
    </div>
  );
};
