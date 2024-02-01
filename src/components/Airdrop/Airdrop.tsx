/* eslint-disable no-await-in-loop */
import { FC, ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { formatEther } from '@ethersproject/units';
import { openNotification, Spinner, Tag, Typography } from '@subql/components';
import { renderAsyncArray } from '@subql/react-hooks';
import { mergeAsync } from '@subql/react-hooks/dist/utils';
import { useMount } from 'ahooks';
import { Button, Table, TableProps } from 'antd';
import { BigNumber } from 'ethers';
import i18next from 'i18next';
import { uniqWith } from 'lodash-es';
import { useAccount } from 'wagmi';

import { TOKEN } from 'appConstants';
import { GIFT } from 'containers';
import { useContracts } from 'hooks';
import { useIpfs } from 'hooks/useIpfs';
import { mapContractError } from 'utils';

import styles from './Airdrop.module.less';
import { AirdropAmountHeader } from './AirdropAmountHeader';
import { AirdropClaimButton } from './AirdropClaimButton';

enum AirdropRoundStatus {
  CLAIMED = 'CLAIMED',
  EXPIRED = 'EXPIRED',
  LOCKED = 'LOCKED',
  UNLOCKED = 'UNLOCKED',
  REDEEMED = 'REDEEMED'
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

const AirdropStatusTag: FC<{ status: AirdropRoundStatus }> = ({ status }) => {
  const statusMapping: { [key: string]: { color: 'success' | 'info' | 'default' | 'error'; text: string } } = {
    [AirdropRoundStatus.CLAIMED]: { color: 'success', text: i18next.t('airdrop.claimed') },
    [AirdropRoundStatus.UNLOCKED]: { color: 'info', text: i18next.t('airdrop.unlocked') },
    [AirdropRoundStatus.LOCKED]: { color: 'default', text: i18next.t('airdrop.locked') },
    [AirdropRoundStatus.EXPIRED]: { color: 'error', text: i18next.t('airdrop.expired') },
    [AirdropRoundStatus.REDEEMED]: { color: 'success', text: i18next.t('airdrop.redeemed') }
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

export const Airdrop: FC = () => {
  const { t } = useTranslation();
  const { address: account } = useAccount();
  const { catSingle } = useIpfs();
  const contracts = useContracts();

  const [nftSerices, setNftSerices] = useState<NftIpfs>({});
  const [redeemLoading, setRedeemLoading] = useState<boolean>(false);
  const [redeemable, setRedeemable] = useState<boolean>(false);

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

  useMount(() => {
    getRedeemable();
  });

  return (
    <div className={styles.container}>
      {renderAsyncArray(
        mergeAsync(accountUnclaimGifts, accountClaimedGifts, redeemable ? accountRedeemedGifts : { loading: false }),
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
            if (!data) return null;
            const [unClaimGifts, userNfts, redeemedNfts] = data;
            const redeemNftsTokenIds = redeemedNfts?.userRedeemedNfts.nodes.map((i) => i.tokenId) || [];

            const renderTable = sortGifts(
              unClaimGifts || { userUnclaimedNfts: { nodes: [] } },
              userNfts || { userNfts: { nodes: [], groupedAggregates: [] } },
              redeemedNfts || { userRedeemedNfts: { nodes: [], groupedAggregates: [] } }
            );

            const unlockSeriesIds = unClaimGifts?.userUnclaimedNfts.nodes.map((i) => i.seriesId) || [];
            const canRedeemNfts = userNfts?.userNfts.nodes.filter((i) => !redeemNftsTokenIds.includes(i.id)) || [];

            return (
              <div className={styles.airdropClaimContainer}>
                <Typography variant="h6">{t('airdrop.claimTitle', { token: TOKEN })}</Typography>
                <br />
                <Typography style={{ marginTop: 8 }} type="secondary">
                  {t('airdrop.description')}
                </Typography>
                <AirdropAmountHeader
                  unlockedAirdropAmount={BigNumber.from(0)}
                  claimedAirdropAmount={BigNumber.from(0)}
                />

                {renderTable.length > 0 ? (
                  <>
                    <Table
                      className={styles.darkTable}
                      columns={getColumns(t)}
                      dataSource={[...renderTable]}
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
                      <AirdropClaimButton unlockSeriesIds={unlockSeriesIds} />
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
