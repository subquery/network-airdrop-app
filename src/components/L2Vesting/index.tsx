import React, { FC, useEffect, useMemo, useState } from 'react';
import { BsWallet2 } from 'react-icons/bs';
import { FaRegCheckCircle } from 'react-icons/fa';
import { TfiArrowTopRight } from 'react-icons/tfi';
import { formatEther } from '@ethersproject/units';
import { Spinner, SubqlProvider, Typography } from '@subql/components';
import mainnetJSON from '@subql/contract-sdk/publish/mainnet.json';
import testnetJSON from '@subql/contract-sdk/publish/testnet.json';
import { useAsyncMemo } from '@subql/react-hooks';
import { useInterval } from 'ahooks';
import { Button, ButtonProps, Modal } from 'antd';
import { BigNumber } from 'ethers';
import { t } from 'i18next';
import { isString } from 'lodash-es';
import moment from 'moment';
import { useAccount, useNetwork, useSwitchNetwork, useWalletClient } from 'wagmi';

import { TOKEN } from 'appConstants';
import { l2ChainName } from 'components/Airdrop/AirdropClaimButton';
import { NotificationType, openNotificationWithIcon } from 'components/Notification';
import { l2ChainId, useContracts } from 'hooks';
import { useSign } from 'hooks/useSign';
import { convertSecondsToTimeString, formatAmount, renderAsync, roundToSix } from 'utils';

import styles from './index.module.less';

interface IProps {}

const vestingAddress =
  process.env.REACT_APP_NETWORK === 'testnet' ? testnetJSON.root.Vesting.address : mainnetJSON.root.Vesting.address;

interface VestingAllocationPlanNode {
  planId: string;
  startDate: moment.Moment | string;
  plan: {
    id: string;
    lockPeriod: string;
    totalAllocation: string;
    vestingPeriod: string;
  };
}

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

export const useModalSuccess = () => {
  const { data: walletClient } = useWalletClient();
  const contracts = useContracts();

  return {
    toastModal: (successTokenValue?: string) => {
      Modal.success({
        getContainer: () => document.querySelector('.appBody') || document.body,
        width: 800,
        className: styles.successModal,
        title: (
          <SubqlProvider theme="dark">
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <FaRegCheckCircle style={{ fontSize: 22, color: 'var(--sq-success)' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Typography variant="h6">You’ve claimed {successTokenValue || ''} SQT!</Typography>
                <Typography type="secondary">Congratulations, you’ve claimed your SQT.</Typography>
              </div>
            </div>
          </SubqlProvider>
        ),
        content: (
          <SubqlProvider theme="dark">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div className={styles.successModalBaseLayout}>
                <div className={styles.successModalBaseLayoutLeft}>
                  <Typography className={styles.successModalBaseLayoutLeftTitle}>
                    <BsWallet2 style={{ fontSize: 20, color: 'var(--sq-blue600)' }} />
                    Add the SQT token to your wallet
                  </Typography>
                  <Typography type="secondary">Add your tokens to your wallet here so you can see them</Typography>
                </div>

                <Button
                  className={styles.guideBtn}
                  type="primary"
                  shape="round"
                  size="large"
                  onClick={() => {
                    walletClient?.request({
                      method: 'wallet_watchAsset',
                      // @ts-ignore
                      params: {
                        type: 'ERC20',
                        options: {
                          address: contracts?.sqToken.address,
                          symbol: TOKEN,
                          decimals: 18
                        }
                      }
                    });
                  }}
                >
                  Add Tokens to Wallet
                </Button>
              </div>

              <Typography>Now, what can you do with your SQT?</Typography>

              <div className={styles.successModalBaseLayout}>
                <div className={styles.successModalBaseLayoutLeft}>
                  <Typography className={styles.successModalBaseLayoutLeftTitle}>
                    <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M0.833252 13.2592C0.833252 12.5689 1.3929 12.0092 2.08325 12.0092H4.87172C5.56207 12.0092 6.12171 12.5689 6.12171 13.2592V17.1054C6.12171 17.7957 5.56207 18.3554 4.87171 18.3554H2.08325C1.39289 18.3554 0.833252 17.7957 0.833252 17.1054V13.2592Z"
                        fill="#4388DD"
                      />
                      <path
                        d="M7.53198 7.97076C7.53198 7.28041 8.09163 6.72076 8.78198 6.72076H11.5704C12.2608 6.72076 12.8204 7.28041 12.8204 7.97076V17.1054C12.8204 17.7957 12.2608 18.3554 11.5704 18.3554H8.78198C8.09163 18.3554 7.53198 17.7957 7.53198 17.1054V7.97076Z"
                        fill="#C2D7F0"
                      />
                      <path
                        d="M14.2307 1.27203C14.2307 0.581679 14.7904 0.0220337 15.4807 0.0220337H18.2692C18.9595 0.0220337 19.5192 0.581678 19.5192 1.27203V17.1054C19.5192 17.7957 18.9595 18.3554 18.2692 18.3554H15.4807C14.7904 18.3554 14.2307 17.7957 14.2307 17.1054V1.27203Z"
                        fill="#C2D7F0"
                      />
                    </svg>
                    Delegate your SQT
                  </Typography>
                  <Typography type="secondary" variant="medium">
                    Delegating SQT is an easy way to stake your SQT and earn up to 7% APR. It only takes a few minutes
                  </Typography>
                  <Typography type="secondary" variant="medium">
                    <em>Takes only a few minutes, and can provide solid APR</em>
                  </Typography>
                </div>
                <a
                  href="https://academy.subquery.network/subquery_network/delegators/delegating.html "
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button className={styles.guideBtn} type="primary" shape="round" size="large">
                    Follow the steps to Delegate
                    <TfiArrowTopRight />
                  </Button>
                </a>
              </div>

              <div className={styles.successModalBaseLayout}>
                <div className={styles.successModalBaseLayoutLeft}>
                  <Typography className={styles.successModalBaseLayoutLeftTitle}>
                    <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M0.833252 13.2592C0.833252 12.5689 1.3929 12.0092 2.08325 12.0092H4.87172C5.56207 12.0092 6.12171 12.5689 6.12171 13.2592V17.1054C6.12171 17.7957 5.56207 18.3554 4.87171 18.3554H2.08325C1.39289 18.3554 0.833252 17.7957 0.833252 17.1054V13.2592Z"
                        fill="#4388DD"
                      />
                      <path
                        d="M7.53198 7.97076C7.53198 7.28041 8.09163 6.72076 8.78198 6.72076H11.5704C12.2608 6.72076 12.8204 7.28041 12.8204 7.97076V17.1054C12.8204 17.7957 12.2608 18.3554 11.5704 18.3554H8.78198C8.09163 18.3554 7.53198 17.7957 7.53198 17.1054V7.97076Z"
                        fill="#4388DD"
                      />
                      <path
                        d="M14.2307 1.27203C14.2307 0.581679 14.7904 0.0220337 15.4807 0.0220337H18.2692C18.9595 0.0220337 19.5192 0.581678 19.5192 1.27203V17.1054C19.5192 17.7957 18.9595 18.3554 18.2692 18.3554H15.4807C14.7904 18.3554 14.2307 17.7957 14.2307 17.1054V1.27203Z"
                        fill="#C2D7F0"
                      />
                    </svg>
                    Boost your favourite project
                  </Typography>
                  <Typography type="secondary" variant="medium">
                    By boosting projects, you can get free requests to it that you can use in your production
                    applications
                  </Typography>
                  <Typography type="secondary" variant="medium">
                    <em>Takes only a few minutes, and get free requests to our network</em>
                  </Typography>
                </div>
                <a
                  href="https://academy.subquery.network/subquery_network/consumers/boosting.html"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button className={styles.guideBtn} type="primary" shape="round" size="large">
                    Learn to Boost
                    <TfiArrowTopRight />
                  </Button>
                </a>
              </div>

              <div className={styles.successModalBaseLayout}>
                <div className={styles.successModalBaseLayoutLeft}>
                  <Typography className={styles.successModalBaseLayoutLeftTitle}>
                    <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M0.833252 13.2592C0.833252 12.5689 1.3929 12.0092 2.08325 12.0092H4.87172C5.56207 12.0092 6.12171 12.5689 6.12171 13.2592V17.1054C6.12171 17.7957 5.56207 18.3554 4.87171 18.3554H2.08325C1.39289 18.3554 0.833252 17.7957 0.833252 17.1054V13.2592Z"
                        fill="#4388DD"
                      />
                      <path
                        d="M7.53198 7.97076C7.53198 7.28041 8.09163 6.72076 8.78198 6.72076H11.5704C12.2608 6.72076 12.8204 7.28041 12.8204 7.97076V17.1054C12.8204 17.7957 12.2608 18.3554 11.5704 18.3554H8.78198C8.09163 18.3554 7.53198 17.7957 7.53198 17.1054V7.97076Z"
                        fill="#4388DD"
                      />
                      <path
                        d="M14.2307 1.27203C14.2307 0.581679 14.7904 0.0220337 15.4807 0.0220337H18.2692C18.9595 0.0220337 19.5192 0.581678 19.5192 1.27203V17.1054C19.5192 17.7957 18.9595 18.3554 18.2692 18.3554H15.4807C14.7904 18.3554 14.2307 17.7957 14.2307 17.1054V1.27203Z"
                        fill="#4388DD"
                      />
                    </svg>
                    Become a Node Operator
                  </Typography>
                  <Typography type="secondary" variant="medium">
                    Node Operators can receive significant rewards (up to 20% APR) for running nodes for the SubQuery
                    Network
                  </Typography>
                  <Typography type="secondary" variant="medium">
                    <em>Requires some technical expertise, but can mean much higher APR</em>
                  </Typography>
                </div>
                <a
                  href="https://academy.subquery.network/subquery_network/node_operators/introduction.html "
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button className={styles.guideBtn} type="primary" shape="round" size="large">
                    Become a Node Operator
                    <TfiArrowTopRight />
                  </Button>
                </a>
              </div>
            </div>
          </SubqlProvider>
        ),
        icon: null,
        closable: true,
        okButtonProps: {
          style: { display: 'none' }
        }
      });
    }
  };
};

const L2Vesting: FC<IProps> = () => {
  const contracts = useContracts();
  const { address: account } = useAccount();
  const { toastModal } = useModalSuccess();
  const { hasSignedTC, onSignTC } = useSign();
  const { switchNetwork } = useSwitchNetwork();
  const { chain } = useNetwork();

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
          startDate: startDate?.toNumber() ? moment.unix(startDate?.toNumber()) : '-',
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
        startDate: moment.unix(+new Date()),
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
        planId: node.planId.split(':')[1],
        startDate: node.startDate
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

  const claimOne = async (contractAddress: string, planId: string, expectTokens?: string) => {
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
        toastModal(expectTokens);

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
  }, [accountPlans.data, account]);

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
    error: (e) => <Typography>No Seekers Vesting available</Typography>,
    data: () => (
      <div className={styles.vesting}>
        <Typography variant="h6" weight={500}>
          Seekers Program - Vested SQT
        </Typography>
        <Typography type="secondary" style={{ marginTop: 8 }}>
          If you are an eligble user of the SubQuery Seekers campaign, and have been awarded vested SQT from the Seekers
          Program, you can claim it below.
        </Typography>
        {accountPlans.data?.map((node: VestingAllocationPlanNode, index) => {
          const vestingPeriod = +node.plan.vestingPeriod;
          const lockPeriod = +node.plan.lockPeriod;
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
                    Vesting start:{' '}
                    {isString(node?.startDate) ? node?.startDate : node?.startDate.format('DD/MM/YYYY hh:mm A')}
                  </Typography>
                </div>

                <TransactionButton
                  shape="round"
                  type="primary"
                  onClick={async () => {
                    if (chain?.id !== l2ChainId) {
                      switchNetwork?.(l2ChainId);
                      return;
                    }
                    if (!hasSignedTC) {
                      await onSignTC();
                    }
                    await claimOne(contractAddress, planId, roundToSix(formatEther(planClaimable.toString())));
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
                  {chain?.id !== l2ChainId ? `Switch to ${l2ChainName}` : 'Claim Tokens'}
                </TransactionButton>
              </div>
              <div className={styles.vestingChunkContent}>
                {!vestingPeriod ? (
                  ''
                ) : (
                  <Typography type="secondary">
                    {lockPeriod > 0 ? `${convertSecondsToTimeString(lockPeriod)} lock-up with ` : ''}{' '}
                    {convertSecondsToTimeString(vestingPeriod)} vesting{' '}
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
