import React, { FC, useEffect, useMemo, useState } from 'react';
import { formatEther } from '@ethersproject/units';
import { Spinner, Typography } from '@subql/components';
import mainnetJSON from '@subql/contract-sdk/publish/mainnet.json';
import testnetJSON from '@subql/contract-sdk/publish/testnet.json';
import { useAsyncMemo } from '@subql/react-hooks';
import { useInterval } from 'ahooks';
import { Button, ButtonProps } from 'antd';
import { BigNumber } from 'ethers';
import { t } from 'i18next';
import moment from 'moment';
import { useAccount } from 'wagmi';

import { TOKEN } from 'appConstants';
import { NotificationType, openNotificationWithIcon } from 'components/Notification';
import { useContracts } from 'hooks';
import { useSign } from 'hooks/useSign';
import { convertCountToTime, formatAmount, renderAsync, roundToSix } from 'utils';

import styles from './index.module.less';

interface IProps {}

const vestingAddress =
  process.env.REACT_APP_NETWORK === 'testnet' ? testnetJSON.root.Vesting.address : mainnetJSON.root.Vesting.address;

interface VestingAllocationPlanNode {
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
    name: 'Seeker Program Rewards'
  }
];

const L2Vesting: FC<IProps> = () => {
  const contracts = useContracts();
  const { address: account } = useAccount();

  const { hasSignedTC, onSignTC } = useSign();

  const accountPlans = useAsyncMemo(async () => {
    const allPlans = await contracts?.l2Vesting.plansLength();

    const plans = await Promise.allSettled(
      Array.from({ length: allPlans?.toNumber() || 0 }).map((_, i) => contracts?.l2Vesting.plans(i))
    );

    return Array.from({ length: allPlans?.toNumber() || 0 }).map((_, index) => {
      const result = plans[index];
      if (result.status === 'fulfilled') {
        const startDate = result.value?.startDate;
        return {
          planId: `${contracts?.l2Vesting.address}:${index}`,
          startDate: moment.unix(startDate?.toNumber() || +new Date()),
          plan: {
            id: `${index}`,
            vestingPeriod: result.value?.vestingPeriod.toString() || '0',
            lockPeriod: result.value?.lockPeriod.toString() || '0',
            totalAllocation: result.value?.totalAllocation.toString() || '0'
          }
        };
      }

      return {
        planId: `${contracts?.l2Vesting.address}:${index}`,
        startDate: +new Date(),
        plan: {
          id: `${index}`,
          vestingPeriod: '0',
          lockPeriod: '0',
          totalAllocation: '0'
        }
      };
    });
  }, [account, contracts]);

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
    if (!accountPlans?.data) return BigNumber.from('0');
    return accountPlans.data?.reduce((cur, add) => {
      const claimTokenInfo = claimableTokens.find(
        (i) => i.contractAddress === add.planId.split(':')[0] && i.planId === add.planId.split(':')[1]
      );
      return cur
        .add(claimTokenInfo?.allocation || BigNumber.from('0'))
        .sub(claimTokenInfo?.claimed || BigNumber.from('0'))
        .sub(claimTokenInfo?.claimable || BigNumber.from('0'));
    }, BigNumber.from('0'));
  }, [claimableTokens, accountPlans, totalAvailableClaim, totalClaimed]);

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

    const vestingContract = contracts?.l2Vesting;

    const fetchData = await Promise.allSettled([
      vestingContract?.claimableAmount(planId, account),
      vestingContract?.claimed(planId, account),
      vestingContract?.allocations(planId, account)

      // this can be cache, if necessary.
      // vestingContract?.vestingStartDate()
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
      planId,
      claimable: claimable.status === 'fulfilled' ? claimable.value || BigNumber.from('0') : BigNumber.from('0'),
      claimed: claimed.status === 'fulfilled' ? claimed.value || BigNumber.from('0') : BigNumber.from('0'),
      allocation: allocation.status === 'fulfilled' ? allocation.value || BigNumber.from('0') : BigNumber.from('0'),
      startDate: moment.unix(1708675200)
    };
  };

  const initClaimableAmount = async () => {
    if (!accountPlans?.data) return;
    const plansInfo: { contractAddress: string; planId: string }[] = accountPlans.data.map(
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
      const vestingContract = contracts?.l2Vesting;

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

        {accountPlans.data?.map((node: VestingAllocationPlanNode, index) => {
          const vestingPeriod = Math.floor(+node.plan.vestingPeriod / oneDay);
          const lockPeriod = Math.floor(+node.plan.lockPeriod / oneDay);
          const contractAddress = node.planId.split(':')[0];
          const planId = node.planId.split(':')[1];
          const claimTokenInfo = claimableTokens.find(
            (i) => i.contractAddress === contractAddress && i.planId === planId
          );
          const amount = claimTokenInfo?.allocation || BigNumber.from('0');
          const planTotalClaimed = claimTokenInfo?.claimed || BigNumber.from('0');
          const planClaimable = claimTokenInfo?.claimable || BigNumber.from('0');
          return (
            <div className={styles.vestingChunk} key={`${node.planId}:${index}`}>
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
export default L2Vesting;
