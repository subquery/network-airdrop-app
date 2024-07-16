/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { CSSProperties, FC, forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { BsInfoCircle } from 'react-icons/bs';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { IoMdCheckmark } from 'react-icons/io';
import { animated, AnimatedProps, useSpringRef, useTransition } from '@react-spring/web';
import { Markdown, openNotification, Spinner, Typography } from '@subql/components';
import { useAsyncMemo } from '@subql/react-hooks';
import { useSize } from 'ahooks';
import { Button, Collapse, Input, Modal, Skeleton, Tooltip } from 'antd';
import BigNumber from 'bignumber.js';
import clsx from 'clsx';
import rehypeRaw from 'rehype-raw';
import { useAccount as useAccountWagmi } from 'wagmi';

import { Loading } from 'components/Loading/Loading';
import { ContactUs, WalletDetect } from 'components/WalletDetect/WalletDetect';
import {
  IDelegationUserInfo,
  IMyEraInfoItem,
  IMyLootboxItem,
  useDelegationCampaignApi
} from 'hooks/useDelegationCampaignApi';
import { formatNumber, formatNumberWithLocale, formatWithBlank } from 'utils';

import heartFireworks from './heartFireworks/heartFireworks';
import LootboxAnimation from './lootboxAnimation/LootboxAnimation';
import styles from './DelegationCampaign.module.less';
import { FirstStep } from './Register';

interface IProps {}

const rootUrl = new URL(window.location.href).origin || 'https://frenzy.subquery.foundation';

const useAccount = () => {
  const p = useAccountWagmi();

  return {
    ...p,
    address: new URL(window.location.href).searchParams.get('customAddress') || p.address
  };
};

const minDelegationAmount = 3000;
const rankPointRule = (rank: number, delegation: string, isCurEra: boolean) => {
  if (isCurEra) return 0;
  if (BigNumber(delegation).lt(minDelegationAmount)) return 0;
  if (rank === 1) return 15_000;
  if (rank === 2) return 10_000;
  if (rank === 3) return 5_000;
  if (rank <= 10) return 2_000;
  if (rank <= 20) return 1_000;
  if (rank <= 100) return 500;
  return 0;
};

const delegationAmountPoint = (amount: string) => {
  if (BigNumber(amount).lt(minDelegationAmount)) return '0';
  return Math.ceil(Math.floor(+amount / 10)).toFixed(0);
};
const rewardsAmountPoint = (amount: string, delegation: string) => {
  if (BigNumber(delegation).lt(minDelegationAmount)) return '0';
  return Math.ceil(70 * Math.floor(+amount)).toFixed(0);
};

interface LootboxItemRef {
  open: () => void;
}

const LootboxItem = forwardRef<LootboxItemRef, { item: IMyLootboxItem; customTitle?: string; refresh: () => void }>(
  (props, ref) => {
    const { item, customTitle, refresh } = props;
    const { address: account } = useAccount();
    const [isOpen, setIsOpen] = useState(false);
    const [animationOff, setAnimationOff] = useState(false);
    const [opening, setOpening] = useState(false);
    const { openLootbox } = useDelegationCampaignApi({
      alert: true
    });

    const openLootboxFunc = async () => {
      heartFireworks();
      setTimeout(() => {
        setIsOpen(true);
      }, 1500);
    };

    useImperativeHandle(ref, () => ({
      open: openLootboxFunc
    }));

    return (
      <div className={styles.lootboxItem}>
        <Typography variant="medium">Lootbox {item.num}</Typography>
        {item.completed ? (
          <Typography>+{formatNumberWithLocale(item.point, 0)} points!</Typography>
        ) : (
          <Button
            size="small"
            shape="round"
            type="primary"
            onClick={openLootboxFunc}
            iconPosition="end"
            disabled={item.completed}
            loading={opening}
          >
            Open Lootbox
          </Button>
        )}

        <Modal
          open={isOpen}
          onCancel={() => {
            setIsOpen(false);
          }}
          okButtonProps={{
            style: { display: 'none' }
          }}
          cancelButtonProps={{ style: { display: 'none' } }}
          closeIcon={<></>}
          destroyOnClose
          className={styles.lootboxModal}
          afterOpenChange={(val) => {
            setAnimationOff(val);
          }}
          width={600}
        >
          {animationOff && (
            <div
              className={clsx(styles.baseCard, styles.lootboxWrapper)}
              onClick={() => {
                setIsOpen(false);
              }}
              role="button"
              tabIndex={0}
            >
              <div style={{ height: 300, marginTop: 120, transform: 'translateY(45px)' }}>
                <LootboxAnimation></LootboxAnimation>
              </div>

              <Typography variant="h4">{customTitle || `Lootbox for Era ${item.era}`}</Typography>

              <Typography variant="medium" type="secondary" style={{ textAlign: 'center' }}>
                By staking more SQT, you get more opportunities to win with lootboxes. Check back at the end of each Era
                for new lootboxes that you can open and win.
              </Typography>

              <Button
                onClick={async () => {
                  try {
                    setOpening(true);
                    await openLootbox({
                      wallet: account || '',
                      era: item.era,
                      num: item.num
                    });
                    await refresh();

                    setIsOpen(false);
                  } finally {
                    setOpening(false);
                  }
                }}
                shape="round"
                type="primary"
                loading={opening}
              >
                Collect the Points!
              </Button>
            </div>
          )}
        </Modal>
      </div>
    );
  }
);

const SecondStep = (props: { userInfo?: IDelegationUserInfo['data'] }) => {
  const { userInfo } = props;
  const { address: account } = useAccount();
  const { getMyEraInfo, getMyLootbox } = useDelegationCampaignApi({
    alert: false
  });
  const ref = useRef<HTMLDivElement>(null);
  const eraCardRefs = useRef<HTMLDivElement[]>([]);
  const [myEraInfo, setMyEraInfo] = useState<IMyEraInfoItem[]>([]);
  const [currentSelectEra, setCurrentSelectEra] = useState<IMyEraInfoItem>();
  const [myLootboxes, setMyLootboxes] = useState<IMyLootboxItem[]>([]);
  const [eraInfoLoading, setEraInfoLoading] = useState(false);
  const [fetchingLootboxLoading, setFetchingLootboxLoading] = useState(false);
  // one scroll chunk is 337px 321 width + 16 gap
  const [scrollChunk] = useState(337 * 2);

  const curEra = useMemo(() => userInfo?.era_config.find((i) => i.key === 'current_era'), [userInfo]);

  const fetchLootboxes = async (era: number | string, shouldLoading = true) => {
    try {
      if (shouldLoading) {
        setFetchingLootboxLoading(true);
      }
      const res = await getMyLootbox({
        wallet: account || '',
        era
      });

      setMyLootboxes(res.data?.data || []);
    } finally {
      setFetchingLootboxLoading(false);
    }
  };

  const fetchMyEraInfo = async (shouldLoading = true) => {
    try {
      if (shouldLoading) {
        setEraInfoLoading(true);
      }
      const res = await getMyEraInfo({
        wallet: account || ''
      });

      const startEraTemp = userInfo?.era_config.find((i) => i.key === 'start_era');
      const curEraTemp = userInfo?.era_config.find((i) => i.key === 'current_era');
      const counts = +(curEraTemp?.value || 0) - +(startEraTemp?.value || 0) + 1;
      const eraInfos = new Array(counts < 0 ? 0 : counts)
        .fill(0)
        .map((_, index) => {
          const era = index + +(startEraTemp?.value || 0);
          const eraInfo = res.data.data?.find((i) => +i.era === era);

          return (
            eraInfo || {
              id: +new Date() + Math.random() + index,
              user_id: account || 0,
              era,
              point: 0,
              reward: '0',
              delegation: '0',
              apy: '0',
              rank: 0,
              lootbox: 0
            }
          );
        })
        .reverse();

      try {
        await fetchLootboxes(eraInfos?.[0].era || 0);
      } catch (e) {
        //
      }
      setMyEraInfo(eraInfos || []);

      setCurrentSelectEra(eraInfos?.[0]);

      return eraInfos;
    } finally {
      setEraInfoLoading(false);
    }
  };

  const scrollLeft = () => {
    if (!ref.current) return;
    if (ref.current.scrollLeft - scrollChunk < 0) {
      ref.current.scrollLeft = 0;
      return;
    }
    ref.current.scrollLeft -= scrollChunk;
  };
  const scrollRight = () => {
    if (!ref.current) return;
    if (ref.current.scrollLeft + scrollChunk > ref.current.scrollWidth - scrollChunk) {
      ref.current.scrollLeft = ref.current.scrollWidth - scrollChunk;
      return;
    }
    ref.current.scrollLeft += scrollChunk;
  };

  useEffect(() => {
    fetchMyEraInfo(true);
  }, [account]);

  return (
    <div className={styles.mainInner}>
      <div className={styles.mainTitle}>
        <Typography variant="h1" style={{ textAlign: 'center' }}>
          SubQuery Summer Delegation Frenzy
        </Typography>
        <Typography variant="h5" style={{ textAlign: 'center' }}>
          The more points you earn, the more rewards you&apos;ll receive from the SQT prize pool!
        </Typography>
      </div>

      <div className={styles.challenges} style={{ marginTop: 120 }}>
        <div className={styles.challengesCollapse}>
          <Collapse
            className={clsx(styles.darkCollapse, styles.withoutSplit)}
            ghost
            items={[
              {
                key: 'default',
                label: <Typography variant="large">🎉 Become a delegator and receive rewards today !</Typography>,
                children: (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <Typography type="secondary">
                      A Delegator is a non-technical network role in the SubQuery Network and is a great way to start
                      participating in the SubQuery Network. This role enables Delegators to “delegate” their SQT to one
                      or more Node Operator (RPC Providers or Data Indexers) and earn rewards (similar to staking).
                    </Typography>

                    <div style={{ display: 'flex', gap: 16 }}>
                      <Button type="primary" shape="round" size="large">
                        <a
                          href="https://app.subquery.network/delegator/node-operators/all"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Delegate Now
                        </a>
                      </Button>

                      <Button type="primary" shape="round" size="large" ghost>
                        <a
                          href="https://academy.subquery.network/subquery_network/delegators/delegating.html"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Learn More
                        </a>
                      </Button>
                    </div>

                    <iframe
                      width="100%"
                      height="706"
                      src="https://www.youtube.com/embed/7GKWO5wEdtc?si=QeqtFcIXmA9yy6e5"
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    ></iframe>
                  </div>
                )
              }
            ]}
            defaultActiveKey={['default']}
          />
        </div>
      </div>

      <div className={styles.baseCard}>
        <Typography>Your Achievements</Typography>

        <div className={styles.achievementsLayout}>
          <div className={styles.baseLineBorder}>
            <div className={clsx(styles.baseCard, styles.baseLineGradint, styles.achieveCard)}>
              <Typography>Your Total Rank</Typography>
              <Typography variant="h5" weight={600}>
                # {userInfo?.rank || userInfo?.id}
              </Typography>
            </div>
          </div>

          <div className={styles.baseLineBorder}>
            <div className={clsx(styles.baseCard, styles.baseLineGradint, styles.achieveCard)}>
              <Typography>Programme APY</Typography>
              <Typography variant="h5" weight={600}>
                {userInfo?.apy}%
              </Typography>
            </div>
          </div>

          <div className={styles.baseLineBorder}>
            <div className={clsx(styles.baseCard, styles.baseLineGradint, styles.achieveCard)}>
              <Typography>Your Total Points</Typography>
              <Typography
                variant={
                  BigNumber(userInfo?.total_score || 0).gt(999_9999_9999)
                    ? 'text'
                    : BigNumber(userInfo?.total_score || 0).gt(99_999_999)
                    ? 'large'
                    : 'h5'
                }
                weight={600}
              >
                {formatNumberWithLocale(userInfo?.total_score || 0, 0)} <Typography weight={600}>Points</Typography>
              </Typography>
            </div>
          </div>

          <div className={styles.baseLineBorder}>
            <div className={clsx(styles.baseCard, styles.baseLineGradint, styles.achieveCard)}>
              <Typography>Current Delegation</Typography>
              <Typography variant="h5" weight={600}>
                {formatNumberWithLocale(userInfo?.delegation?.delegation || 0, 0)}{' '}
                <Typography weight={600}>SQT</Typography>
              </Typography>
            </div>
          </div>

          <div className={styles.baseLineBorder}>
            <div className={clsx(styles.baseCard, styles.baseLineGradint, styles.achieveCard)}>
              <Typography>Total Delegation Rewards</Typography>
              <Typography variant="h5" weight={600}>
                {formatNumber(Math.floor(parseFloat(userInfo?.total_reward || '0')))}{' '}
                <Typography weight={600}>SQT</Typography>
              </Typography>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ padding: 5 }}>
            <img
              src={userInfo?.eligible ? '/static/validUser.svg' : '/static/invalidUser2.svg'}
              alt=""
              style={{ width: 32, height: 38 }}
            ></img>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography>{userInfo?.eligible ? 'Yes, you are a valid participant !' : 'Pending Validation'}</Typography>
            <Typography type="secondary" variant="small" style={{ lineHeight: '18px' }}>
              {userInfo?.eligible ? (
                'You have successfully delegated 3,000 SQT for two entire Eras. '
              ) : (
                <>
                  You must actively delegate at least 3,000 SQT for two entire Eras during the program to become a valid
                  participant.{' '}
                  <Typography.Link
                    href="https://app.subquery.network/delegator/node-operators/all"
                    type="info"
                    target="_blank"
                    variant="small"
                    style={{
                      textDecoration: 'underline'
                    }}
                  >
                    Delegate Now
                  </Typography.Link>
                </>
              )}
            </Typography>
          </div>
        </div>
      </div>

      <div className={clsx(styles.eraInfo, styles.baseCard)}>
        {eraInfoLoading ? (
          <Skeleton
            active
            avatar
            round
            paragraph={{
              rows: 20
            }}
            style={{ height: 898 }}
          ></Skeleton>
        ) : (
          <>
            {myEraInfo.length ? (
              <>
                <div className={styles.eraInfoOperator}>
                  <div
                    className={styles.eraInfoOperatorArrow}
                    onClick={() => {
                      scrollLeft();
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <FaChevronLeft style={{ color: '#fff' }}></FaChevronLeft>
                  </div>
                  <div
                    className={styles.eraInfoOperatorArrow}
                    onClick={() => {
                      scrollRight();
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <FaChevronRight style={{ color: '#fff' }}></FaChevronRight>
                  </div>
                </div>

                <div ref={ref} className={styles.eraInfoCardLayout}>
                  {myEraInfo.map((item, index) => (
                    <div
                      key={item.id}
                      className={clsx(
                        styles.baseLineBorder,
                        currentSelectEra?.id === item.id ? styles.selectedCard : styles.plainCard
                      )}
                      ref={(cardRef) => {
                        if (cardRef) {
                          eraCardRefs.current[index] = cardRef;
                        }
                      }}
                      onClick={async () => {
                        if (eraInfoLoading || fetchingLootboxLoading) return;
                        setCurrentSelectEra(item);
                        eraCardRefs.current[index]?.scrollIntoView({
                          block: 'nearest'
                        });
                        await fetchLootboxes(item.era);
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <div className={clsx(styles.baseCard, styles.baseLineGradint, styles.eraInfoCard)}>
                        {index === 0 ? (
                          <Typography variant="medium" type="secondary">
                            <div style={{ display: 'inline-flex', gap: 8 }}>
                              <img src="/static/location.svg" alt=""></img>
                              Era {item.era}
                            </div>
                            <br></br>
                            <Typography variant="small" type="secondary">
                              *Check back after the era ends for your results
                            </Typography>
                          </Typography>
                        ) : (
                          <div className={styles.previousEraTitle}>
                            <Typography variant="medium" type="secondary">
                              Era {item.era}
                            </Typography>
                            <div className={styles.colorfulButtonBorder}>
                              <Button type="primary" shape="round" size="small">
                                Ranked {formatWithBlank(item.rank || '0', '#', 'left')}
                              </Button>
                            </div>
                          </div>
                        )}
                        <div className={styles.split}></div>
                        <div className={styles.eraInfoCardLines}>
                          <div className={styles.eraInfoCardLine}>
                            <Typography variant="medium" type="secondary">
                              Points Earned
                            </Typography>
                            <Typography variant="medium">
                              {formatWithBlank(formatNumberWithLocale(item.point, 0), 'points')}
                            </Typography>
                          </div>
                          <div className={styles.eraInfoCardLine}>
                            <Typography variant="medium" type="secondary">
                              Delegation Rewards
                            </Typography>
                            <Typography variant="medium">
                              {formatWithBlank(
                                formatNumberWithLocale(Math.floor(parseFloat(item.reward || '0')), 0),
                                'SQT'
                              )}
                            </Typography>
                          </div>
                          <div className={styles.eraInfoCardLine}>
                            <Typography variant="medium" type="secondary">
                              Delegated Amount
                            </Typography>
                            <Typography variant="medium">
                              {formatWithBlank(
                                formatNumberWithLocale(Math.floor(parseFloat(item.delegation || '0')), 0),
                                'SQT'
                              )}
                            </Typography>
                          </div>
                          <div className={styles.eraInfoCardLine}>
                            <Typography variant="medium" type="secondary">
                              APY
                            </Typography>
                            <Typography variant="medium">{formatWithBlank(item.apy, '%')}</Typography>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Typography variant="large" weight={600}>
                  Era {currentSelectEra?.era}
                </Typography>
              </>
            ) : (
              <Typography>
                The SubQuery Delegation Frenzy Program starts on Era 21 (from Friday 5th July), please check back later!
              </Typography>
            )}

            <div className={styles.eraEarnedInfo}>
              <div className={clsx(styles.baseCard, styles.nestedBaseCard)}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="large">Points for Each Delegated SQT</Typography>

                  <div
                    className={clsx(
                      styles.colorfulButtonBorder,
                      delegationAmountPoint(currentSelectEra?.delegation || '0') === '0' ? styles.disableColorful : ''
                    )}
                  >
                    <Button type="primary" shape="round" size="small">
                      +{formatNumberWithLocale(delegationAmountPoint(currentSelectEra?.delegation || '0'), 0)} points
                    </Button>
                  </div>
                </div>
                <div className={styles.split}></div>
                {currentSelectEra && currentSelectEra?.id !== myEraInfo?.[0]?.id && (
                  <Typography>
                    You delegated{' '}
                    {formatNumberWithLocale(Math.floor(parseFloat(currentSelectEra?.delegation || '0')), 0)} SQT for Era{' '}
                    {currentSelectEra?.era}
                  </Typography>
                )}

                <Typography>For every 10 SQT your delegate for the complete Era, you get 1 point!</Typography>
              </div>
              <div className={clsx(styles.baseCard, styles.nestedBaseCard)}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="large">Points for SQT Rewards</Typography>
                  <div
                    className={clsx(
                      styles.colorfulButtonBorder,
                      rewardsAmountPoint(currentSelectEra?.reward || '0', currentSelectEra?.delegation || '0') === '0'
                        ? styles.disableColorful
                        : ''
                    )}
                  >
                    <Button type="primary" shape="round" size="small">
                      +
                      {formatNumberWithLocale(
                        rewardsAmountPoint(currentSelectEra?.reward || '0', currentSelectEra?.delegation || '0'),
                        0
                      )}{' '}
                      points
                    </Button>
                  </div>
                </div>
                <div className={styles.split}></div>
                {currentSelectEra && currentSelectEra?.id !== myEraInfo?.[0]?.id && (
                  <Typography>
                    You claimed {formatNumberWithLocale(Math.floor(parseFloat(currentSelectEra?.reward || '0')), 0)} SQT
                    of rewards for Era {currentSelectEra?.era}
                  </Typography>
                )}
                <Typography>For every SQT your claim as rewards for the Era, you get 70 points!</Typography>
              </div>

              <div className={clsx(styles.baseCard, styles.nestedBaseCard)}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="large">Best Performing Delegators</Typography>
                  <div
                    className={clsx(
                      styles.colorfulButtonBorder,
                      rankPointRule(
                        +(currentSelectEra?.rank || 99999999),
                        currentSelectEra?.delegation || '0',
                        currentSelectEra?.era === +(curEra?.value || currentSelectEra?.era || 0)
                      ) === 0
                        ? styles.disableColorful
                        : ''
                    )}
                  >
                    <Button type="primary" shape="round" size="small">
                      +
                      {formatNumberWithLocale(
                        rankPointRule(
                          +(currentSelectEra?.rank || 99999999),
                          currentSelectEra?.delegation || '0',
                          currentSelectEra?.era === +(curEra?.value || currentSelectEra?.era || 0)
                        ),
                        0
                      )}{' '}
                      points
                    </Button>
                  </div>
                </div>
                <div className={styles.split}></div>
                <Typography>Rank as a top performing delegator in this Era to earn bonus points</Typography>
                <Typography>
                  1st: 15,000 points
                  <br />
                  2nd: 10,000 points
                  <br />
                  3rd: 5,000 points
                  <br />
                  Top 10: 2,000 points
                  <br />
                  Top 20: 1,000 points
                  <br />
                  Top 100: 500 points
                </Typography>
              </div>

              <div className={clsx(styles.baseCard, styles.nestedBaseCard)}>
                {fetchingLootboxLoading ? (
                  <Skeleton
                    active
                    style={{
                      height: 406
                    }}
                    paragraph={{
                      rows: 10
                    }}
                  ></Skeleton>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="large">Random Weekly Lootboxes!</Typography>

                      <div
                        className={clsx(
                          styles.colorfulButtonBorder,
                          myLootboxes.filter((i) => i.completed).reduce((a, b) => a + +b.point, 0)
                            ? ''
                            : styles.disableColorful
                        )}
                      >
                        <Button type="primary" shape="round" size="small">
                          +
                          {formatNumberWithLocale(
                            myLootboxes.filter((i) => i.completed).reduce((a, b) => a + +b.point, 0),
                            0
                          )}{' '}
                          points
                        </Button>
                      </div>
                    </div>
                    <div className={styles.split}></div>
                    {myLootboxes.length <= 0 ? (
                      <Typography>
                        Weekly lootboxes will appear here, please check them out later and claim them.
                      </Typography>
                    ) : (
                      <Typography>
                        You have received {myLootboxes.length} lootboxes from Era {currentSelectEra?.era}!
                      </Typography>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {myLootboxes.map((item) => (
                        <LootboxItem
                          key={item.id}
                          item={item}
                          refresh={() => {
                            fetchLootboxes(currentSelectEra?.era || 0, false);
                          }}
                        ></LootboxItem>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

interface RenderChallenge {
  id: number | string;
  name: string;
  success: boolean;
  reward: number;
  description: string;
  render?: React.ReactNode;
  cta?: string;
  cta_url?: string;
  key?: string;
}

const MainChallenges = (props: { userInfo?: IDelegationUserInfo['data'] }) => {
  const { userInfo } = props;
  const { address: account } = useAccount();

  const [userChallenges, setUserChallenges] = useState<RenderChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const { getOneoffChallenges } = useDelegationCampaignApi({
    alert: false
  });
  const size = useSize(document.body);

  const lootboxRef = useRef<LootboxItemRef>(null);

  const initChallenges = async () => {
    try {
      if (!account) return;
      setLoading(true);

      const res = await getOneoffChallenges({
        wallet: account
      });
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const challenges: RenderChallenge[] =
        res?.data?.data?.map((i) => ({
          id: i.challenge.id,
          reward: +(i.userChallenge?.point || 0) || +i.challenge.point,
          success: !!i?.userChallenge?.completed,
          name: i.challenge.title,
          description: i.challenge.description,
          cta: i.challenge.cta,
          cta_url: i.challenge.cta_url,
          key: i.challenge.key
        })) || [];
      challenges.push({
        id: 'referral',
        name: 'Referral Bonus',
        success: +(userInfo?.referral_count || 0) > 0,
        reward: 500 * Math.max(+(userInfo?.referral_count || 0), 1),
        render: (
          <div style={{ display: 'flex', flexDirection: 'column', border: 'none', borderRadius: 8, gap: 16 }}>
            <Typography>
              When your friend signs up and onboards with your referral link, you both receive an extra 500 points.
            </Typography>

            <Input
              className="darkInput"
              value={`${rootUrl}/?referral=${userInfo?.referral_code}`}
              onChange={() => ({})}
            />

            <div className={styles.referralButtons}>
              <Button
                shape="round"
                ghost
                type="primary"
                size="large"
                style={{ flex: 1 }}
                onClick={() => {
                  navigator.clipboard.writeText(`${rootUrl}/?referral=${userInfo?.referral_code}`);

                  openNotification({
                    type: 'success',
                    description: 'Referral Link Copied to Clipboard. Go out there and share it!',
                    duration: 5
                  });
                }}
              >
                Copy your referral link
              </Button>
              <a
                style={{ flex: 1 }}
                target="_blank"
                href={`mailto:yourfriend@email.com?subject=Join%20me%20in%20SubQuery's%20Summer%20Delegation%20Frenzy!&body=Hi%20there%2C%0D%0A%0D%0AI%20recently%20joined%20the%20SubQuery%20Summer%20Delegation%20Frenzy%20and%20I%20want%20to%20invite%20you%20too!%0D%0A%0D%0ASubQuery%20are%20giving%20away%20big%20rewards%20to%20their%20most%20valued%20community%20members%20in%20the%20delegation%20program.%0D%0ASimply%20register%20for%20the%20campaign%20using%20this%20referral%20link%2C%20and%20start%20delegating%20(staking)%20to%20receive%20points%20as%20well%20as%2014%25%20APY.%20The%20more%20challenges%20we%20complete%2C%20the%20more%20points%20we%20earn!%20%F0%9F%A5%B3%0D%0A%0D%0AI%E2%80%99ve%20been%20having%20a%20blast%20so%20far%20participating%20in%20the%20SubQuery%20Network%20and%20learning%20about%20the%20web3%20infrastructure%20revolution%20they%20have%20planned.%20The%20delegation%20rewards%20definitely%20help%20too!%0D%0A%0D%0AHere%E2%80%99s%20my%20invite%20link%20if%20you%20want%20to%20sign%20up%20and%20complete%20onboarding%20to%20instantly%20earn%202000%20points%3A%20https%3A%2F%2Fdelegation.subquery.foundation%2F%3Freferral%3D${props.userInfo?.referral_code}%0D%0A%0D%0ASee%20you%20there!%20%F0%9F%91%80`}
                rel="noreferrer"
              >
                <Button shape="round" ghost type="primary" size="large" style={{ width: '100%' }}>
                  Send as email
                </Button>
              </a>
              <a
                style={{ flex: 1 }}
                target="_blank"
                rel="noreferrer"
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`@SubQueryNetwork is running the SubQuery Summer Delegation Frenzy campaign where you can delegate to earn points and receive SQT tokens #SQTDelegationFrenzy
  
  Join me here to get a bonus: ${rootUrl}/?referral=${userInfo?.referral_code}`)}`}
              >
                <Button shape="round" ghost type="primary" size="large" style={{ width: '100%' }}>
                  Post on X (Twitter)
                </Button>
              </a>
            </div>

            <ContactUs mode="delegationCampaign" />
          </div>
        ),
        description: '',
        cta: '' // TODO
      });
      setUserChallenges(challenges);
    } finally {
      setLoading(false);
    }
  };

  const renderChallenges = useMemo(() => {
    const renderWelcome = (challenge: RenderChallenge) => {
      if (challenge.key !== 'random.1') return null;

      return (
        <div>
          <Button
            shape="round"
            size="large"
            type="primary"
            style={{ marginTop: 16, width: '100%' }}
            ghost={challenge.success}
            disabled={challenge.success}
            onClick={() => {
              lootboxRef.current?.open();
            }}
          >
            {challenge.success ? 'Lootbox Claimed' : 'Open Lootbox Now!'}
          </Button>
          <div style={{ display: 'none' }}>
            <LootboxItem
              ref={lootboxRef}
              item={{
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                id: 1,
                user_id: 1,
                challenge_id: 1,
                type: 1,
                era: 0,
                num: 0,
                point: 0,
                completed: challenge.success,
                completed_at: new Date().toISOString()
              }}
              refresh={initChallenges}
              customTitle="New Delegator Welcome!"
            ></LootboxItem>
          </div>
        </div>
      );
    };

    return userChallenges.map((challenge) => ({
      key: challenge.key || challenge.id,
      label: (
        <div style={{ display: 'flex', alignItems: 'center', marginRight: 10, gap: 10, flexWrap: 'wrap' }}>
          <div className={clsx(styles.check, challenge.success ? styles.checkActive : '')}>
            {challenge.success && <IoMdCheckmark style={{ fontSize: 21 }} />}
          </div>
          <Typography variant="large">{challenge.name}</Typography>

          <span style={{ flex: 1, display: (size?.width || 999) >= 768 ? 'block' : 'none' }} />

          {challenge.id === 'referral' ? (
            <Typography variant="medium" style={{ color: 'var(--sq-gray200)', marginRight: 8 }}>
              {userInfo?.pending_referral_count || userInfo?.referral_count ? (
                <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                  {userInfo?.pending_referral_count ? (
                    <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                      {userInfo?.pending_referral_count || 0} Pending referrals
                      <Tooltip title="The referral has not yet met the eligibility criteria. To become valid, the referral must delegate 3,000 SQT for at least 2 eras.">
                        <BsInfoCircle style={{ color: 'var(--sq-gray500)', fontSize: 14 }}></BsInfoCircle>
                      </Tooltip>
                      <span style={{ color: 'var(--sq-gray400)' }}>|</span>
                    </span>
                  ) : (
                    ''
                  )}
                  <span>{userInfo?.referral_count || 0} Valid Referrals</span>
                </span>
              ) : (
                ''
              )}
            </Typography>
          ) : (
            ''
          )}
          {challenge.reward ? (
            <div className={styles.colorfulButtonBorder}>
              <Button type="primary" shape="round" size="small">
                +{challenge.reward} Points!
              </Button>
            </div>
          ) : (
            ''
          )}
        </div>
      ),
      children: challenge.render || (
        <div className={styles.markdownWrapper}>
          <Markdown.Preview rehypePlugins={[rehypeRaw]}>{`${challenge.description}`}</Markdown.Preview>
          {renderWelcome(challenge)}
          {challenge.cta && (
            <a href={challenge.cta_url} target="_blank" rel="noreferrer">
              <Button shape="round" size="large" type="primary" style={{ marginTop: 16, width: '100%' }}>
                {challenge.cta}
              </Button>
            </a>
          )}
        </div>
      )
    }));
  }, [userChallenges, initChallenges]);

  useEffect(() => {
    initChallenges();
  }, []);

  return (
    <div className={styles.challenges}>
      <div className={styles.naviLine}>
        <div style={{ width: 24, height: 24, background: 'var(--sq-blue600)', borderRadius: '50%' }}></div>
      </div>
      <div className={styles.challengesCollapse}>
        <Typography variant="h5">One-off Challenges</Typography>
        <Collapse className={styles.darkCollapse} ghost items={renderChallenges} defaultActiveKey={['referral']} />
      </div>
    </div>
  );
};

const Leaderboard = (props: { userInfo?: IDelegationUserInfo['data'] }) => {
  const { userInfo } = props;
  const { address: account } = useAccount();

  const { getUserLeaderboard } = useDelegationCampaignApi({
    alert: false
  });

  const userLeaderboard = useAsyncMemo(async () => {
    const res = await getUserLeaderboard({
      wallet: account || ''
    });

    return res.data;
  }, [account]);

  return (
    <div
      className={styles.baseCard}
      style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', margin: '32px auto 140px auto' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="large">Compete to get the highest score, you can do it!</Typography>
      </div>
      {userLeaderboard.loading ? null : (
        <Typography variant="medium" type="secondary">
          You are ranked {userInfo?.rank || userInfo?.id} of {userLeaderboard.data?.data?.count} participants
        </Typography>
      )}

      <div style={{ display: 'flex', background: 'rgba(0, 0, 0, 0.23)', padding: 8, borderRadius: 8, gap: 16 }}>
        <div style={{ flex: 1, maxWidth: 60 }}>
          <Typography>#</Typography>
        </div>
        <div style={{ flex: 1 }}>
          <Typography>Name</Typography>
        </div>
        <div style={{ flex: 1 }}>
          <Typography>APY</Typography>
        </div>
        <div style={{ flex: 1 }}>
          <Typography>Total Rewards</Typography>
        </div>
        <div style={{ flex: 1 }}>
          <Typography>Total Score</Typography>
        </div>
      </div>

      {userLeaderboard.loading ? (
        <div style={{ width: '100%', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Spinner></Spinner>
        </div>
      ) : (
        ''
      )}

      {/* overflow auto, a quick fix for mobile version,  */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, overflow: 'auto' }}>
        {userLeaderboard.data?.data?.top7?.map((summary, index) => (
          <div
            key={`${summary.wallet}${index}`}
            className={clsx(
              styles.tableItem,
              summary.wallet.toLowerCase() === account?.toLowerCase() ? styles.mine : ''
            )}
          >
            <div style={{ flex: 1, maxWidth: 60 }}>
              <Typography type="secondary">{summary.rank || summary.id}</Typography>
            </div>
            <div style={{ flex: 1 }}>
              <Typography tooltip={summary.wallet} type="secondary">
                {`${summary.wallet?.slice(0, 5)}...${summary.wallet?.slice(
                  summary.wallet.length - 5,
                  summary.wallet.length
                )}`}
              </Typography>
            </div>

            <div style={{ flex: 1 }}>
              <Typography type="secondary">{summary.apy.toLocaleString()} %</Typography>
            </div>

            <div style={{ flex: 1 }}>
              <Typography type="secondary">{summary.total_reward.toLocaleString()} SQT</Typography>
            </div>

            <div style={{ flex: 1 }}>
              <Typography type="secondary">{summary.total_score.toLocaleString()} points</Typography>
            </div>
          </div>
        ))}
        {userLeaderboard.data?.data?.beforeMe ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Typography type="secondary">
              {userLeaderboard.data?.data?.beforeMe.toLocaleString()} other participants
            </Typography>
          </div>
        ) : (
          ''
        )}

        {userLeaderboard.data?.data?.me?.map((summary, index) => (
          <div
            key={`${summary.wallet}${index}`}
            className={clsx(
              styles.tableItem,
              summary.wallet.toLowerCase() === account?.toLowerCase() ? styles.mine : ''
            )}
          >
            <div style={{ flex: 1, maxWidth: 60 }}>
              <Typography type="secondary">{summary.rank}</Typography>
            </div>
            <div style={{ flex: 1 }}>
              <Typography tooltip={summary.wallet} type="secondary">
                {`${summary.wallet?.slice(0, 5)}...${summary.wallet?.slice(
                  summary.wallet.length - 5,
                  summary.wallet.length
                )}`}
              </Typography>
            </div>

            <div style={{ flex: 1 }}>
              <Typography type="secondary">{summary.apy.toLocaleString()} %</Typography>
            </div>

            <div style={{ flex: 1 }}>
              <Typography type="secondary">{summary.total_reward.toLocaleString()} SQT</Typography>
            </div>

            <div style={{ flex: 1 }}>
              <Typography type="secondary">{summary.total_score.toLocaleString()} points</Typography>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const transitionsLoading: ((props: AnimatedProps<{ style: CSSProperties }>) => React.ReactElement)[] = [
  ({ style }) => (
    <animated.div
      style={{
        ...style,
        background: 'var(--dark-mode-background)',
        position: 'fixed',
        width: '100%',
        height: '100%',
        zIndex: 999,
        top: 0,
        paddingTop: 80
      }}
    >
      <Loading></Loading>
    </animated.div>
  ),
  ({ style }) => <></>
];

const DelegationCampaign: FC<IProps> = (props) => {
  const { address: account, isConnected } = useAccount();

  const { getUserInfo } = useDelegationCampaignApi({
    alert: true
  });

  const [fetchLoading, setFetchLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<IDelegationUserInfo['data']>();
  const [transitionIndex, setTransitionIndex] = useState(0);

  const userStage = useMemo(() => {
    if (!userInfo) return 0;
    if (!userInfo.email_verified) return 1;

    return 2;
  }, [userInfo]);

  const height = useMemo(() => {
    if (!isConnected || userStage === 0 || userStage === 1) {
      return 700;
    }

    return 600;
  }, [userStage, isConnected]);

  const transRef = useSpringRef();
  const transitions = useTransition(transitionIndex, {
    ref: transRef,
    keys: null,
    from: { opacity: 1, transform: 'scale(1)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    leave: { opacity: 0, transform: 'scale(1)' },
    config: {
      duration: 300
    }
  });

  const fetchUserInfo = async (shouldLoading = true) => {
    try {
      if (shouldLoading) {
        setTransitionIndex(0);
        setFetchLoading(true);
      }
      if (!account) {
        setTimeout(() => {
          setTransitionIndex(1);
        }, 300);
        return;
      }
      const res = await getUserInfo({
        wallet: account
      });

      setUserInfo(res.data.data);
      setTimeout(() => {
        setTransitionIndex(1);
        if (res.data.data && res.data.data.email_verified) {
          const scrollY = localStorage.getItem('prevScrolled');
          window.scrollTo(0, scrollY ? +scrollY : 0);
        }
      }, 300);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [account]);

  useEffect(() => {
    transRef.start();
  }, [transitionIndex]);

  useEffect(() => {
    const savePrevScrolled = () => {
      localStorage.setItem('prevScrolled', window.scrollY.toString());
    };
    window.addEventListener('beforeunload', savePrevScrolled);

    return () => {
      window.removeEventListener('beforeunload', savePrevScrolled);
    };
  }, []);

  return (
    <div className={styles.delegationCampaign}>
      {transitions((style, item) => {
        const Comp = transitionsLoading[item];
        return <Comp style={style}></Comp>;
      })}
      {!fetchLoading && (
        <>
          <picture
            className={styles.delegationCampaignBg}
            style={{
              height,
              minHeight: height
            }}
          >
            <source srcSet="/static/currentEraBg3.webp" type="image/webp" />
            <img src="/static/currentEraBg3.png" alt="" />
          </picture>
          <div
            className={styles.delegationCampaignMain}
            style={{
              minHeight: height
            }}
          >
            <WalletDetect mode="delegationCampaign" style={{ marginTop: 144 }}>
              <>
                {userStage === 0 || userStage === 1 ? (
                  <FirstStep
                    userInfo={userInfo}
                    refresh={async () => {
                      await fetchUserInfo(false);
                    }}
                  ></FirstStep>
                ) : (
                  ''
                )}
                {userStage === 2 ? (
                  <>
                    <SecondStep userInfo={userInfo}></SecondStep>
                    <MainChallenges userInfo={userInfo}></MainChallenges>
                    <Leaderboard userInfo={userInfo}></Leaderboard>
                  </>
                ) : (
                  ''
                )}
              </>
            </WalletDetect>
          </div>
        </>
      )}
    </div>
  );
};

export default DelegationCampaign;
