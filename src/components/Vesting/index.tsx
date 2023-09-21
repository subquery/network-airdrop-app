import React, { FC, useEffect, useMemo, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Spinner, Typography } from '@subql/components';
import VestingPlansConf from '@subql/contract-sdk/publish/vesting.json';
import { useInterval } from 'ahooks';
import { Button } from 'antd';
import { BigNumber } from 'ethers';
import { t } from 'i18next';

import { NotificationType, openNotificationWithIcon } from 'components/Notification';
import { useWeb3, VESTING } from 'containers';
import { useVestingContracts } from 'hooks';
import { convertCountToTime, formatAmount, renderAsync } from 'utils';

import styles from './index.module.less';

interface IProps {}

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

const vestingPlans = VestingPlansConf[process.env.REACT_APP_NETWORK as 'kepler' | 'testnet' | 'mainnet'].map(
  (contractAddress, index) => ({
    contractAddress,
    name: index === 0 ? 'SERIES A INVESTORS' : 'PRIVATE SALE INVESTORS'
  })
);

const Vesting: FC<IProps> = () => {
  const vestingContractFactor = useVestingContracts();
  const { account } = useWeb3();
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

  const [transLoading, setTransLoading] = useState(false);
  const [claimableTokens, setCliamableTokens] = useState<
    { contractAddress: string; claimable: BigNumber; claimed: BigNumber; allocation: BigNumber }[]
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

  const getClaimableAmount = async (contractAddress: string) => {
    if (!account)
      return {
        contractAddress,
        claimable: BigNumber.from('0'),
        claimed: BigNumber.from('0'),
        allocation: BigNumber.from('0')
      };
    const vestingContract = await vestingContractFactor(contractAddress);

    const fetchData = await Promise.allSettled([
      vestingContract?.claimableAmount(account),
      vestingContract?.claimed(account),
      vestingContract?.allocations(account)
    ]);

    if (fetchData.some((i) => i.status === 'rejected')) {
      openNotificationWithIcon({
        type: NotificationType.ERROR,
        title: 'Fetch data failure',
        description:
          'Use cached data first, please refresh the page and change your RPC endpoint to make sure fetch lastest data.'
      });
    }

    const [claimable, claimed, allocation] = fetchData;

    return {
      contractAddress,
      claimable: claimable.status === 'fulfilled' ? claimable.value || BigNumber.from('0') : BigNumber.from('0'),
      claimed: claimed.status === 'fulfilled' ? claimed.value || BigNumber.from('0') : BigNumber.from('0'),
      allocation: allocation.status === 'fulfilled' ? allocation.value || BigNumber.from('0') : BigNumber.from('0')
    };
  };

  const initClaimableAmount = async () => {
    if (!accountPlans?.data?.vestingAllocations?.nodes) return;
    const plansContactAddresses: string[] = accountPlans.data.vestingAllocations.nodes.map(
      (node: VestingAllocationPlanNode) => node.planId.split(':')[0]
    );

    try {
      const res = await Promise.all(plansContactAddresses.map((i) => getClaimableAmount(i)));

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

  const claimOne = async (contractAddress: string) => {
    if (!account) return;
    try {
      setTransLoading(true);
      const vestingContract = await vestingContractFactor(contractAddress);
      const approvalTx = await vestingContract?.claim();
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
    } finally {
      setTransLoading(false);
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
      <div className={styles.vesting} style={{ alignItems: 'center' }}>
        <Spinner />
      </div>
    ),
    error: (e) => <Typography>{e.message}</Typography>,
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
            <Typography variant="large" style={{ color: '#fff' }}>
              Total Locked
            </Typography>
            <Typography variant="large" style={{ color: '#fff' }} weight={600}>
              {formatAmount(totalLocked)}
            </Typography>
          </div>
          <div className={styles.vestingHeaderItem}>
            <Typography variant="large" style={{ color: '#fff' }}>
              Total Claimed
            </Typography>
            <Typography variant="large" style={{ color: '#fff' }} weight={600}>
              {formatAmount(totalClaimed)}
            </Typography>
          </div>
          <div className={styles.vestingHeaderItem}>
            <Typography variant="large" style={{ color: '#fff' }}>
              Available to Claim
            </Typography>
            <Typography variant="large" style={{ color: '#fff' }} weight={600}>
              {formatAmount(totalAvailableClaim)}
            </Typography>
          </div>
        </div>

        {accountPlans.data.vestingAllocations.nodes.map((node: VestingAllocationPlanNode) => {
          const vestingPeriod = Math.floor(+node.plan.vestingPeriod / oneDay);
          const lockPeriod = Math.floor(+node.plan.lockPeriod / oneDay);
          const contractAddress = node.planId.split(':')[0];
          const claimTokenInfo = claimableTokens.find((i) => i.contractAddress === contractAddress);
          const amount = claimTokenInfo?.allocation || BigNumber.from(node.amount);
          const planTotalClaimed = claimTokenInfo?.claimed || BigNumber.from('0');
          const planClaimable = claimTokenInfo?.claimable || BigNumber.from('0');
          return (
            <div className={styles.vestingChunk} key={node.id}>
              <div className={styles.vestingChunkHeader}>
                <Typography variant="small" weight={600} style={{ color: 'var(--sq-gray700)' }}>
                  {vestingPlans.find((i) => i.contractAddress === contractAddress)?.name || ''}
                </Typography>

                <Button
                  shape="round"
                  type="primary"
                  onClick={() => {
                    claimOne(contractAddress);
                  }}
                  loading={transLoading}
                  disabled={
                    !!(
                      claimableTokens.find((i) => i.contractAddress === contractAddress)?.claimable.eq(0) ||
                      !claimableTokens.find((i) => i.contractAddress === contractAddress)
                    )
                  }
                >
                  Claim Token
                </Button>
              </div>
              <div className={styles.vestingChunkContent}>
                <Typography style={{ color: 'var(--sq-gray700)' }}>
                  {convertCountToTime(lockPeriod)} cliff with linear unlock over the next{' '}
                  {convertCountToTime(vestingPeriod)}
                </Typography>

                <div className={styles.vestingChunkContentInfo}>
                  <Typography>Locked: {formatAmount(amount.sub(planTotalClaimed).sub(planClaimable))}</Typography>
                  <Typography>Claimed: {formatAmount(planTotalClaimed)}</Typography>
                  <Typography>Available to Claim: {formatAmount(planClaimable)}</Typography>
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
