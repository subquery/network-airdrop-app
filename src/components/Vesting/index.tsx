import React, { FC, useEffect, useMemo, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { formatEther } from '@ethersproject/units';
import { Spinner, Typography } from '@subql/components';
import mainnetJSON from '@subql/contract-sdk/publish/mainnet.json';
import testnetJSON from '@subql/contract-sdk/publish/testnet.json';
import { useInterval } from 'ahooks';
import { Button, ButtonProps } from 'antd';
import { BigNumber } from 'ethers';
import { t } from 'i18next';
import moment from 'moment';
import { useAccount } from 'wagmi';

import { TOKEN } from 'appConstants';
import { NotificationType, openNotificationWithIcon } from 'components/Notification';
import { VESTING } from 'containers';
import { useVestingContracts } from 'hooks';
import { useSign } from 'hooks/useSign';
import { convertCountToTime, formatAmount, renderAsync, roundToSix } from 'utils';

import styles from './index.module.less';

interface IProps {}

const vestingAddress =
  process.env.REACT_APP_NETWORK === 'testnet' ? testnetJSON.root.Vesting.address : mainnetJSON.root.Vesting.address;

interface VestingAllocationPlanNode {
  amount: string;
  id: string;
  planId: string;
  plan: {
    id: string;
    lockPeriod: string;
    totalAllocation: string;
    vestingPeriod: string;
  };
}

const oneDay = 86400;

const TransactionButton: FC<ButtonProps> = ({ children, onClick, ...rest }) => {
  const [loading, setLoading] = useState(false);
  const innerClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    try {
      setLoading(true);
      await onClick?.(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button {...rest} onClick={innerClick} loading={loading} className={styles.transactionBtn}>
      {children}
    </Button>
  );
};

const vestingPlans = [
  {
    planId: 0,
    name: 'Seed'
  },
  {
    planId: 1,
    name: 'Series A'
  },
  {
    planId: 2,
    name: 'Series B'
  },
  {
    planId: 3,
    name: 'Strategic Round'
  },
  {
    planId: 4,
    name: 'Team & Advisers'
  },
  {
    planId: 5,
    name: 'Foundation & Community'
  },
  {
    planId: 6,
    name: 'Nansen'
  }
];

const Vesting: FC<IProps> = () => {
  const vestingContractFactor = useVestingContracts();
  const { address: account } = useAccount();

  const { hasSignedTC, onSignTC } = useSign();
  const accountPlans = useQuery(
    gql`
      query ($account: String!) {
        vestingAllocations(filter: { id: { includesInsensitive: $account } }) {
          nodes {
            id
            planId
            amount
            plan {
              id
              totalAllocation
              vestingPeriod
              lockPeriod
            }
          }
        }
      }
    `,
    {
      variables: {
        account
      },
      fetchPolicy: 'no-cache',
      context: {
        clientName: VESTING
      }
    }
  );

  const [claimableTokens, setCliamableTokens] = useState<
    {
      contractAddress: string;
      planId: string;
      claimable: BigNumber;
      claimed: BigNumber;
      allocation: BigNumber;
      startDate: moment.Moment;
    }[]
  >([]);

  const totalAvailableClaim = useMemo(
    () => claimableTokens.reduce((cur, add) => cur.add(add.claimable), BigNumber.from(0)),
    [claimableTokens]
  );

  const totalClaimed = useMemo(
    () => claimableTokens.reduce((cur, add) => cur.add(add.claimed), BigNumber.from(0)),
    [claimableTokens]
  );

  const totalLocked = useMemo(() => {
    if (!claimableTokens.length) return BigNumber.from('0');
    if (!accountPlans?.data?.vestingAllocations?.nodes) return BigNumber.from('0');
    const allAmounts: BigNumber = accountPlans?.data?.vestingAllocations?.nodes.reduce(
      (cur: BigNumber, add: VestingAllocationPlanNode) => cur.add(BigNumber.from(add.amount)),
      BigNumber.from(0)
    );

    return allAmounts.sub(totalAvailableClaim).sub(totalClaimed);
  }, [accountPlans, totalAvailableClaim, totalClaimed]);

  const getClaimableAmount = async (contractAddress: string, planId: string) => {
    if (!account)
      return {
        contractAddress,
        planId,
        claimable: BigNumber.from('0'),
        claimed: BigNumber.from('0'),
        allocation: BigNumber.from('0'),
        startDate: moment()
      };
    const vestingContract = await vestingContractFactor(vestingAddress);

    const fetchData = await Promise.allSettled([
      vestingContract?.claimableAmount(planId, account),
      vestingContract?.claimed(planId, account),
      vestingContract?.allocations(planId, account),

      // this can be cache, if necessary.
      vestingContract?.vestingStartDate()
    ]);

    if (fetchData.some((i) => i.status === 'rejected')) {
      openNotificationWithIcon({
        type: NotificationType.ERROR,
        title: 'Fetch data failure',
        description:
          'Use cached data first, please refresh the page and change your RPC endpoint to make sure fetch lastest data.'
      });
    }

    const [claimable, claimed, allocation, startDate] = fetchData;

    return {
      contractAddress,
      planId,
      claimable: claimable.status === 'fulfilled' ? claimable.value || BigNumber.from('0') : BigNumber.from('0'),
      claimed: claimed.status === 'fulfilled' ? claimed.value || BigNumber.from('0') : BigNumber.from('0'),
      allocation: allocation.status === 'fulfilled' ? allocation.value || BigNumber.from('0') : BigNumber.from('0'),
      startDate: moment.unix(startDate.status === 'fulfilled' ? +`${startDate.value?.toString()}` : 1708675200)
    };
  };

  const initClaimableAmount = async () => {
    if (!accountPlans?.data?.vestingAllocations?.nodes) return;
    const plansInfo: { contractAddress: string; planId: string }[] = accountPlans.data.vestingAllocations.nodes.map(
      (node: VestingAllocationPlanNode) => ({
        contractAddress: node.planId.split(':')[0],
        planId: node.planId.split(':')[1]
      })
    );

    try {
      const res = await Promise.all(plansInfo.map((i) => getClaimableAmount(i.contractAddress, i.planId)));

      setCliamableTokens(res);
    } catch (e) {
      openNotificationWithIcon({
        type: NotificationType.ERROR,
        title: 'Fetch data failure',
        description:
          'Use cached data first, please refresh the page and change your RPC endpoint to make sure fetch lastest data.'
      });
    }
  };

  const claimOne = async (contractAddress: string, planId: string) => {
    if (!account) return;
    try {
      const vestingContract = await vestingContractFactor(contractAddress);

      const approvalTx = await vestingContract?.claim(planId);
      if (!approvalTx) {
        openNotificationWithIcon({ title: 'There have something wrong, please contact developers' });
        return;
      }
      openNotificationWithIcon({ title: t('notification.txSubmittedTitle') });
      const approvalTxResult = await approvalTx.wait();
      if (approvalTxResult.status) {
        openNotificationWithIcon({
          type: NotificationType.SUCCESS,
          title: t('vesting.success'),
          description: t('notification.changeValidIn15s')
        });

        initClaimableAmount();
        accountPlans.refetch();
      } else {
        openNotificationWithIcon({
          type: NotificationType.ERROR,
          title: 'Transaction failure.',
          description: t('notification.error')
        });
      }
    } catch (e: any) {
      openNotificationWithIcon({
        type: NotificationType.ERROR,
        title: 'Transaction failure.',
        description: e.message || t('notification.error')
      });
    }
  };

  useEffect(() => {
    if (!account) return;
    initClaimableAmount();
  }, [accountPlans, account]);

  useInterval(() => {
    initClaimableAmount();
    // one minite
  }, 60000);

  return renderAsync(accountPlans, {
    loading: () => (
      <div className={styles.vesting} style={{ alignItems: 'center', minHeight: 500 }}>
        <Spinner />
      </div>
    ),
    error: (e) => <Typography>No Vesting available</Typography>,
    data: () => (
      <div className={styles.vesting}>
        <Typography variant="h6" weight={500}>
          Vesting
        </Typography>
        <Typography type="secondary" style={{ marginTop: 8 }}>
          Here you can see your vested token
        </Typography>

        <div className={styles.vestingHeader}>
          <div className={styles.vestingHeaderItem}>
            <Typography variant="large">Total Locked</Typography>
            <Typography variant="large" weight={600} tooltip={formatAmount(totalLocked)}>
              {roundToSix(formatEther(totalLocked))} {TOKEN}
            </Typography>
          </div>
          <div className={styles.vestingHeaderItem}>
            <Typography variant="large">Total Claimed</Typography>
            <Typography variant="large" weight={600} tooltip={formatAmount(totalClaimed)}>
              {roundToSix(formatEther(totalClaimed))} {TOKEN}
            </Typography>
          </div>
          <div className={styles.vestingHeaderItem}>
            <Typography variant="large">Available to Claim</Typography>
            <Typography variant="large" weight={600} tooltip={formatAmount(totalAvailableClaim)}>
              {roundToSix(formatEther(totalAvailableClaim))} {TOKEN}
            </Typography>
          </div>
        </div>

        {accountPlans.data.vestingAllocations.nodes.map((node: VestingAllocationPlanNode) => {
          const vestingPeriod = Math.floor(+node.plan.vestingPeriod / oneDay);
          const lockPeriod = Math.floor(+node.plan.lockPeriod / oneDay);
          const contractAddress = node.planId.split(':')[0];
          const planId = node.planId.split(':')[1];
          const claimTokenInfo = claimableTokens.find(
            (i) => i.contractAddress === contractAddress && i.planId === planId
          );
          const amount = claimTokenInfo?.allocation || BigNumber.from(node.amount);
          const planTotalClaimed = claimTokenInfo?.claimed || BigNumber.from('0');
          const planClaimable = claimTokenInfo?.claimable || BigNumber.from('0');
          return (
            <div className={styles.vestingChunk} key={node.id}>
              <div className={styles.vestingChunkHeader}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="small" weight={600} type="secondary">
                    {vestingPlans.find((i) => `${i.planId}` === `${planId}`)?.name || ''}
                  </Typography>
                  <Typography type="secondary" variant="small" style={{ marginTop: 8 }}>
                    Vesting start: {claimTokenInfo?.startDate.format('DD/MM/YYYY hh:mm A')}
                  </Typography>
                </div>

                <TransactionButton
                  shape="round"
                  type="primary"
                  onClick={async () => {
                    if (!hasSignedTC) {
                      await onSignTC();
                    }
                    await claimOne(contractAddress, planId);
                  }}
                  disabled={
                    !!(
                      claimableTokens
                        .find((i) => i.contractAddress === contractAddress && i.planId === planId)
                        ?.claimable.eq(0) ||
                      !claimableTokens.find((i) => i.contractAddress === contractAddress && i.planId === planId)
                    )
                  }
                >
                  Claim Token
                </TransactionButton>
              </div>
              <div className={styles.vestingChunkContent}>
                {!vestingPeriod ? (
                  ''
                ) : (
                  <Typography type="secondary">
                    {convertCountToTime(lockPeriod)} lock-up with {convertCountToTime(vestingPeriod)} vesting{' '}
                  </Typography>
                )}

                <div className={styles.vestingChunkContentInfo}>
                  <Typography tooltip={formatAmount(amount.sub(planTotalClaimed).sub(planClaimable))}>
                    Locked: {roundToSix(formatEther(amount.sub(planTotalClaimed).sub(planClaimable)))} {TOKEN}
                  </Typography>
                  <Typography tooltip={formatAmount(planTotalClaimed)}>
                    Claimed: {roundToSix(formatEther(planTotalClaimed))} {TOKEN}
                  </Typography>
                  <Typography tooltip={formatAmount(planClaimable)}>
                    Available to Claim: {roundToSix(formatEther(planClaimable))} {TOKEN}
                  </Typography>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )
  });
};
export default Vesting;
