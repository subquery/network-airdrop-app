import React, { FC, useEffect, useMemo, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { IoMdCheckmark } from 'react-icons/io';
// import { MdOutlineMail } from 'react-icons/md';
import { useLocation } from 'react-router-dom';
import { Markdown, openNotification, Typography } from '@subql/components';
import { useAsyncMemo } from '@subql/react-hooks';
import { Button, Collapse, Form, Input } from 'antd';
import { useForm } from 'antd/es/form/Form';
import clsx from 'clsx';
import { useAccount } from 'wagmi';

import { ContactUs, WalletDetect } from 'components/WalletDetect/WalletDetect';
import { useDelegationCampaignApi } from 'hooks/useDelegationCampaignApi';

import styles from './DelegationCampaign.module.less';

interface IProps {}

const rootUrl = new URL(window.location.href).origin || 'https://seekers.subquery.network';

const FirstStep = () => {
  const { search } = useLocation();
  const { address: account } = useAccount();
  const query = useMemo(() => new URLSearchParams(search), [search]);
  const [form] = useForm();
  const [loading, setLoading] = useState(false);

  const signupWithCode = async () => {
    try {
      setLoading(true);
      await form.validateFields();
      if (!account) return false;
      const referralCode = query.get('referral') || '';

      // const res = await signup({
      //   address: account,
      //   referral_code: referralCode,
      //   email: form.getFieldValue('email')
      // });
      // await props.freshFunc?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 48 }}>
      <Typography variant="h3" style={{ width: 600, textAlign: 'center' }}>
        SubQuery Summer Delegation Frenzy
      </Typography>
      <div className={styles.actionModal}>
        <>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16
            }}
          >
            <Typography variant="h5">Email Verification</Typography>
            <Typography variant="medium" type="secondary">
              Please verify your email to register for the Summer Delegation Frenzy
            </Typography>
          </div>

          <Form form={form}>
            <Form.Item
              name="email"
              rules={[
                {
                  async validator(rule, value) {
                    if (!value) {
                      return Promise.reject(new Error('Email is required'));
                    }
                    if (!/^\S+@\S+\.\S+$/.test(value)) {
                      return Promise.reject(new Error('Email is invalid'));
                    }

                    return Promise.resolve();
                  }
                }
              ]}
            >
              <Input className="darkInput" style={{ marginBottom: 0 }} placeholder="Enter your email" />
            </Form.Item>
          </Form>

          <Typography variant="medium" type="secondary">
            By entering your email you have read and agree to our{' '}
            <Typography.Link active href="https://subquery.network/privacy" target="_blank" variant="medium">
              privacy policy
            </Typography.Link>
          </Typography>

          <Button type="primary" shape="round" size="large" onClick={signupWithCode} loading={loading}>
            Submit
          </Button>
        </>

        {/* second step */}
        {/* 
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 16 }}>
          <MdOutlineMail style={{ fontSize: '47px', color: '#fff' }} />
          <Typography variant="h5">Email Verification</Typography>
          <Typography type="secondary" style={{ textAlign: 'center' }}>
            We’ve just sent an onboarding email to your email address (james.bayly@subquery.network)
          </Typography>
          <Typography type="secondary" style={{ textAlign: 'center' }}>
            Click the link on the email you have received from us, make sure to check for it in your spam!
          </Typography>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Typography type="secondary" style={{ textAlign: 'center' }}>
              Didn&apos;t receive an email?{' '}
              <Typography.Link
                onClick={async () => {
                  // await sendEmail(account);
                  // openNotification({
                  //   type: 'success',
                  //   description:
                  //     'We have sent you a new verification link, please check your email address (including your spam account)',
                  //   duration: 10
                  // });
                }}
                type="info"
              >
                Request another one
              </Typography.Link>
            </Typography>
          </div>
        </div> */}

        <ContactUs mode="delegationCampaign" />
      </div>
    </div>
  );
};

const SecondStep = () => {
  const { address: account } = useAccount();

  return (
    <div className={styles.mainInner}>
      <div className={styles.mainTitle}>
        <Typography variant="h1" style={{ textAlign: 'center' }}>
          SubQuery Summer Delegation Frenzy
        </Typography>
        <Typography variant="h5" style={{ textAlign: 'center' }}>
          The more points you earn, the more winnings you’ll receive from the SQT prize pool!
        </Typography>
      </div>

      <div className={styles.baseCard} style={{ marginTop: 220 }}>
        <Typography>Your Achievements</Typography>

        <div style={{ display: 'flex', gap: 16 }}>
          <div className={styles.baseLineBorder}>
            <div className={clsx(styles.baseCard, styles.baseLineGradint, styles.achieveCard)}>
              <Typography>Your Total Rank</Typography>
              <Typography variant="h4" weight={600}>
                # 23
              </Typography>
            </div>
          </div>

          <div className={styles.baseLineBorder}>
            <div className={clsx(styles.baseCard, styles.baseLineGradint, styles.achieveCard)}>
              <Typography>Programme APY</Typography>
              <Typography variant="h4" weight={600}>
                17.3%
              </Typography>
            </div>
          </div>

          <div className={styles.baseLineBorder}>
            <div className={clsx(styles.baseCard, styles.baseLineGradint, styles.achieveCard)}>
              <Typography>Your Total Points</Typography>
              <Typography variant="h4" weight={600}>
                25,231 Points
              </Typography>
            </div>
          </div>

          <div className={styles.baseLineBorder}>
            <div className={clsx(styles.baseCard, styles.baseLineGradint, styles.achieveCard)}>
              <Typography>Total Delegation Rewards</Typography>
              <Typography variant="h4" weight={600}>
                3.20M SQT
              </Typography>
            </div>
          </div>
        </div>
      </div>

      <div className={clsx(styles.eraInfo, styles.baseCard)}>
        <div className={styles.eraInfoOperator}>
          <div className={styles.eraInfoOperatorArrow}>
            <FaChevronLeft style={{ color: '#fff' }}></FaChevronLeft>
          </div>
          <div className={styles.eraInfoOperatorArrow}>
            <FaChevronRight style={{ color: '#fff' }}></FaChevronRight>
          </div>
        </div>

        <div className={styles.eraInfoCardLayout}>
          <div className={clsx(styles.baseLineBorder, styles.selectedCard)}>
            <div className={clsx(styles.baseCard, styles.baseLineGradint, styles.eraInfoCard)}>
              <Typography variant="medium" type="secondary">
                <div style={{ display: 'inline-flex', gap: 8 }}>
                  <img src="/static/location.svg" alt=""></img>
                  Era 12
                </div>
                <br></br>
                <Typography variant="small" type="secondary">
                  *Check back after the era ends for your results
                </Typography>
              </Typography>

              <div className={styles.split}></div>
              <div className={styles.eraInfoCardLines}>
                <div className={styles.eraInfoCardLine}>
                  <Typography variant="medium" type="secondary">
                    Points Earned
                  </Typography>
                  <Typography variant="medium">800,0 points</Typography>
                </div>
                <div className={styles.eraInfoCardLine}>
                  <Typography variant="medium" type="secondary">
                    Delegation Rewards
                  </Typography>
                  <Typography variant="medium">800,0 SQT</Typography>
                </div>
                <div className={styles.eraInfoCardLine}>
                  <Typography variant="medium" type="secondary">
                    Delegated Amount
                  </Typography>
                  <Typography variant="medium">800,0 points</Typography>
                </div>
                <div className={styles.eraInfoCardLine}>
                  <Typography variant="medium" type="secondary">
                    APY
                  </Typography>
                  <Typography variant="medium">18.33%</Typography>
                </div>
              </div>
            </div>
          </div>

          {new Array(10).fill(9).map((i) => (
            <div key={i} className={clsx(styles.baseLineBorder, styles.plainCard)}>
              <div className={clsx(styles.baseCard, styles.baseLineGradint, styles.eraInfoCard)}>
                <div className={styles.previousEraTitle}>
                  <Typography variant="medium" type="secondary">
                    Era 11
                  </Typography>
                  <div className={styles.colorfulButtonBorder}>
                    <Button type="primary" shape="round" size="small">
                      Ranked #23232323
                    </Button>
                  </div>
                </div>

                <div className={styles.split}></div>
                <div className={styles.eraInfoCardLines}>
                  <div className={styles.eraInfoCardLine}>
                    <Typography variant="medium" type="secondary">
                      Points Earned
                    </Typography>
                    <Typography variant="medium">800,0 points</Typography>
                  </div>
                  <div className={styles.eraInfoCardLine}>
                    <Typography variant="medium" type="secondary">
                      Delegation Rewards
                    </Typography>
                    <Typography variant="medium">800,0 SQT</Typography>
                  </div>
                  <div className={styles.eraInfoCardLine}>
                    <Typography variant="medium" type="secondary">
                      Delegated Amount
                    </Typography>
                    <Typography variant="medium">800,0 points</Typography>
                  </div>
                  <div className={styles.eraInfoCardLine}>
                    <Typography variant="medium" type="secondary">
                      APY
                    </Typography>
                    <Typography variant="medium">18.33%</Typography>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Typography variant="large" weight={600}>
          Era 12 (15th June to 21st June)
        </Typography>

        <div className={styles.eraEarnedInfo}>
          <div className={clsx(styles.baseCard, styles.nestedBaseCard)}>
            <Typography variant="large">Points for Each Delegated SQT</Typography>
            <div className={styles.split}></div>
            <Typography>For every 10 SQT your delegate for the complete Era, you get 1 point!</Typography>
          </div>
          <div className={clsx(styles.baseCard, styles.nestedBaseCard)}>
            <Typography variant="large">Points for SQT Rewards</Typography>
            <div className={styles.split}></div>
            <Typography>For every 2 SQT your claim as rewards for the Era, you get 1 point!</Typography>
          </div>

          <div className={clsx(styles.baseCard, styles.nestedBaseCard)}>
            <Typography variant="large">Best Performing Delegators</Typography>
            <div className={styles.split}></div>
            <Typography>Rank as a top performing delegator in this Era to earn bonus points</Typography>
            <Typography>
              1st: 15,000 points
              <br />
              2nd: 10,000 points
              <br />
              3rd: 5,000 points
              <br />
              top 10: 2,000 points
              <br />
              top 20: 1,000 points
              <br />
              top 100: 500 points
            </Typography>
          </div>

          <div className={clsx(styles.baseCard, styles.nestedBaseCard)}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="large">Random Weekly Lootboxes!</Typography>

              <div className={styles.colorfulButtonBorder}>
                <Button type="primary" shape="round" size="small">
                  +999,999 points
                </Button>
              </div>
            </div>
            <div className={styles.split}></div>
            <Typography>You have received 3 lootboxes from Era 12!</Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

const MainChallenges = () => {
  const { address: account } = useAccount();

  const [userChallenges, setUserChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const challenges = useMemo(
    () =>
      userChallenges.map((challenge) => ({
        key: challenge.id,
        label: (
          <div style={{ display: 'flex', alignItems: 'center', marginRight: 10 }}>
            <div className={clsx(styles.check, challenge.success ? styles.checkActive : '')}>
              {challenge.success && <IoMdCheckmark style={{ fontSize: 21 }} />}
            </div>
            <Typography variant="large">{challenge.name}</Typography>

            <span style={{ flex: 1 }} />

            {challenge.id === 0 ? (
              // This is the KYC challenge
              <Typography>{challenge.success ? 'KYC Complete!' : 'KYC Incomplete'}</Typography>
            ) : (
              <div className={styles.colorfulButtonBorder}>
                <Button type="primary" shape="round" size="small">
                  +{challenge.reward} Points!
                </Button>
              </div>
            )}
          </div>
        ),
        children: challenge.render || (
          <div className={styles.markdownWrapper}>
            <Markdown.Preview>{challenge.description}</Markdown.Preview>

            {challenge.cta && (
              <a href={challenge.cta} target="_blank" rel="noreferrer">
                <Button shape="round" size="large" type="primary" style={{ marginTop: 16, width: '100%' }}>
                  {challenge.cta_label}
                </Button>
              </a>
            )}
          </div>
        )
      })),
    [userChallenges]
  );

  const initChallenges = async () => {
    try {
      if (!account) return;
      setLoading(true);
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const challenges = [];
      challenges.push({
        id: 0,
        name: 'Complete KYC for your account',
        success: true,
        reward: 0,
        reward_type: 'FIXED',
        description: `You must complete KYC for your account in order to receive any rewards, click Start KYC and ensure that you complete KYC with the same wallet and email address as you are using for your Seekers account.`,
        cta: 'https://in.sumsub.com/idensic/l/#/uni_cJnVIbYwk7jHnjtK', // TODO
        cta_label: 'Start KYC',
        sort_order: 0
      });
      challenges.push({
        id: 'referral',
        name: 'Referral Bonus',
        success: false,
        reward: 500,
        reward_type: 'FIXED',
        render: (
          <div style={{ display: 'flex', flexDirection: 'column', border: 'none', borderRadius: 8, gap: 16 }}>
            <Typography>
              When your friend signs up and onboards with your referral link, you both increase the multiplier on your
              score.
            </Typography>

            <Input className="darkInput" value={`${rootUrl}/?referral=${2222}`} onChange={() => ({})} />

            <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 16 }}>
              <Button
                shape="round"
                ghost
                type="primary"
                size="large"
                style={{ flex: 1 }}
                onClick={() => {
                  navigator.clipboard.writeText(`${rootUrl}/?referral=${'props.userInfo?.referral_code'}`);

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
                href={`mailto:yourfriend@email.com?subject=Join%20me%20on%20the%20SubQuery%20Seekers%2050%20Million%20SQT%20Challenge%20&body=Hi%20there%2C%0D%0A%0D%0AI%20recently%20joined%20the%20SubQuery%20Seekers%2050%20Million%20SQT%20challenge%20and%20I%20want%20to%20invite%20you%20too!%0D%0A%0D%0ASubQuery%20are%20giving%20away%2050%20Million%20SQT%20to%20their%20most%20valued%20community%20members%20in%20the%20SubQuery%20Seekers%20Program.%20Simply%20register%20for%20the%20campaign%20using%20this%20referral%20link%2C%20and%20start%20exploring%20the%20challenges.%20The%20more%20challenges%20we%20complete%2C%20the%20more%20SQT%20tokens%20we%20can%20earn!%20%F0%9F%A5%B3%0D%0A%0D%0AI%E2%80%99ve%20been%20having%20a%20blast%20so%20far%2C%20learning%20about%20SubQuery%2C%20blockchain%20data%20indexing%20and%20the%20overall%20web3%20infrastructure%20revolution%20they%20have%20planned.%0D%0A%0D%0AHere%E2%80%99s%20my%20invite%20link%20if%20you%20want%20to%20sign%20up%20and%20complete%20onboarding%20to%20instantly%20earn%20200%20points%3A%20https%3A%2F%2Fseekers.subquery.foundation%2F%3Freferral%3D${'props.userInfo?.referral_code'}%0D%0A%0D%0ASee%20you%20there!%20%F0%9F%91%80`}
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
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`@SubQueryNetwork is running the SubQuery Summer Delegation Frenzy where you can complete fun quests to earn points and receive SQT tokens #SQTSummerDelegationFrenzy
  
  Join me here to get a bonus: ${rootUrl}/?referral=${'props.userInfo?.referral_code'}`)}`}
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
        cta: '', // TODO
        cta_label: '',
        sort_order: 1
      });
      setUserChallenges(challenges);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initChallenges();
  }, []);

  return (
    <div className={styles.challenges}>
      <div className={styles.naviLine}>
        <div style={{ width: 24, height: 24, background: 'var(--sq-blue600)', borderRadius: '50%' }}></div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
        <Typography variant="h5">One-off Challenges</Typography>
        <Collapse className={styles.darkCollapse} ghost items={challenges} defaultActiveKey={['referral']} />
      </div>
    </div>
  );
};

const Leaderboard = () => {
  const { address: account } = useAccount();

  const [userLeaderboard, setUserLeaderboard] = useState({
    summary: [
      {
        name: 'sss',
        apy: '999%',
        total_rewards: '99999',
        total_score: 99999,
        rank: 999
      }
    ]
  });

  return (
    <div
      className={styles.baseCard}
      style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', margin: '32px auto 0 auto' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="large">Compete to get the highest score, you can do it!</Typography>
      </div>
      <Typography variant="medium" type="secondary">
        You are ranked 999 of 9999, participants
      </Typography>

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

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {userLeaderboard?.summary.map((summary, index) => {
          const item = (
            <div
              key={`${summary.name}${index}`}
              className={clsx(
                styles.tableItem,
                summary.name.toLowerCase() === account?.toLowerCase() ? styles.mine : ''
              )}
            >
              <div style={{ flex: 1, maxWidth: 60 }}>
                <Typography type="secondary">{summary.rank}</Typography>
              </div>
              <div style={{ flex: 1 }}>
                <Typography tooltip={summary.name} type="secondary">
                  {`${summary.name?.slice(0, 5)}...${summary.name?.slice(
                    summary.name.length - 5,
                    summary.name.length
                  )}`}
                </Typography>
              </div>

              <div style={{ flex: 1 }}>
                <Typography type="secondary">{summary.apy.toLocaleString()}</Typography>
              </div>

              <div style={{ flex: 1 }}>
                <Typography type="secondary">{summary.total_rewards.toLocaleString()} points</Typography>
              </div>

              <div style={{ flex: 1 }}>
                <Typography type="secondary">{summary.total_score.toLocaleString()} points</Typography>
              </div>
            </div>
          );
          let ellipsis: React.ReactNode = '';
          if (index >= 1) {
            const leftParticipants = summary.rank - userLeaderboard.summary[index - 1].rank - 1;
            if (leftParticipants) {
              ellipsis = (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Typography type="secondary">{leftParticipants.toLocaleString()} other participants</Typography>
                </div>
              );
            }
          }
          return (
            <>
              {ellipsis}
              {item}
            </>
          );
        })}
      </div>
    </div>
  );
};

const DelegationCampaign: FC<IProps> = (props) => {
  const { address: account } = useAccount();

  const { getUserInfo } = useDelegationCampaignApi({
    alert: true
  });

  const userInfo = useAsyncMemo(async () => {
    const res = await getUserInfo();
    return res;
  }, [account]);

  const userStage = useMemo(() => {
    if (!userInfo) return 0;
    if (!userInfo) return 1;
    return 2;
  }, [userInfo]);

  return (
    <div className={styles.delegationCampaign}>
      <picture
        className={styles.delegationCampaignBg}
        style={{
          height: '798px' // '934px'
        }}
      >
        <source srcSet="/static/currentEraBg.webp" type="image/webp" />
        <img src="/static/currentEraBg.png" alt="" />
        {/* <img src="/static/delegationCampaign.png" alt="Delegation Campaign" /> */}
      </picture>
      <div className={styles.delegationCampaignMain}>
        <WalletDetect mode="delegationCampaign">
          {/* <FirstStep></FirstStep> */}
          <SecondStep></SecondStep>
        </WalletDetect>
        <MainChallenges></MainChallenges>
        <Leaderboard></Leaderboard>
      </div>
    </div>
  );
};

export default DelegationCampaign;
