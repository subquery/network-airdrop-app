import React, { FC, useEffect, useMemo, useState } from 'react';
import { IoMdCheckmark } from 'react-icons/io';
import { MdOutlineMail } from 'react-icons/md';
import { useLocation } from 'react-router-dom';
import { Markdown, openNotification, Spinner, Typography } from '@subql/components';
import { Button, Collapse, Form, Input } from 'antd';
import { useForm } from 'antd/es/form/Form';
import clsx from 'clsx';
import { useAccount } from 'wagmi';

import { ContactUs } from 'components/WalletDetect/WalletDetect';
import { Challenge, IUserInfo, LeaderboardSummary, useChallengesApi } from 'hooks/useChallengesApi';

import styles from './index.module.less';

interface IProps {}

const rootUrl = new URL(window.location.href).origin || 'https://seekers.subquery.network';

const DefaultLoading = () => (
  <div
    style={{
      minHeight: 500,
      display: 'flex',
      justifyContent: 'center',
      background: 'var(--dark-mode-card)',
      padding: 24
    }}
  >
    <Spinner />
  </div>
);

const FirstStep = (props: { freshFunc?: () => Promise<void> }) => {
  const { address: account } = useAccount();
  const { search } = useLocation();
  const query = useMemo(() => new URLSearchParams(search), [search]);
  const { signup } = useChallengesApi();
  const [form] = useForm();
  const [loading, setLoading] = useState(false);

  const signupWithCode = async () => {
    try {
      setLoading(true);
      await form.validateFields();
      if (!account) return false;
      const referralCode = query.get('referral') || '';
      const res = await signup({
        address: account,
        referral_code: referralCode,
        email: form.getFieldValue('email')
      });
      await props.freshFunc?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Typography variant="h6">SubQuery Seekers 50 Million SQT Challenge</Typography>
        <Typography variant="medium" type="secondary">
          We are giving away 50 Million SQT to our most valued community members in the SubQuery Seekers Program. Simply
          register for the campaign, and start exploring the challenges. The more challenges you complete, the more SQT
          tokens you can earn!
        </Typography>
      </div>
      {query.get('referral') && (
        <div
          style={{
            background: 'var(--sq-gradient)',
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8
          }}
        >
          <Typography variant="h6" weight={600}>
            AWESOME!
          </Typography>
          <Typography variant="large">
            By using this referral link, you and your friend have both a referral bonus after you onboard!
          </Typography>
        </div>
      )}
      <Input className={styles.darkInput} placeholder={account} disabled />

      <Typography variant="medium" type="secondary">
        Enter your email address so we can send you important information about the 50 Million SQT Airdrop Challenge and
        so you can complete KYC when the program finishes.
      </Typography>

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
          <Input className={styles.darkInput} placeholder="Enter your email" />
        </Form.Item>
      </Form>

      <Typography variant="medium" type="secondary">
        By entering your email you have read and agree to our{' '}
        <Typography.Link active href="https://subquery.network/privacy" target="_blank" variant="medium">
          privacy policy
        </Typography.Link>
      </Typography>

      <Button type="primary" shape="round" size="large" onClick={signupWithCode} loading={loading}>
        Sign Up
      </Button>

      <ContactUs />
    </div>
  );
};

const SecondStep = (email: string = 'james.bayly@subquery.network') => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
    <MdOutlineMail style={{ fontSize: '100px', color: '#fff' }} />
    <Typography variant="h6">SubQuery Seekers 50 Million SQT Challenge</Typography>
    <Typography variant="medium" type="secondary">
      We are giving away 50 Million SQT to our most valued community members in the SubQuery Seekers Program. Simply
      register for the campaign, and start exploring the challenges. The more challenges you complete, the more SQT
      tokens you can earn!
    </Typography>
    <Typography type="secondary" style={{ maxWidth: 806, textAlign: 'center', padding: '0 3em' }}>
      We’ve just sent an onboarding email to your email address ({email}). Go and click on the link in it to continue!
    </Typography>
    <ContactUs />
  </div>
);

const MainChallenges = () => {
  const { address: account } = useAccount();
  const { getUserChallenges } = useChallengesApi();

  const [userChallenges, setUserChallenges] = useState<Challenge[]>([]);
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

            {challenge.reward_type === 'FIXED' ? (
              <Typography>+{challenge.reward} Points!</Typography>
            ) : (
              <Typography>+{challenge.reward} Points for each challenge finished!</Typography>
            )}
          </div>
        ),
        children: (
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
      const res = await getUserChallenges(account);
      if (res.status === 200) {
        setUserChallenges(res.data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initChallenges();
  }, [account]);

  if (loading) return <DefaultLoading />;

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        <Typography variant="h6">SubQuery Seekers 50 Million SQT Challenge</Typography>
        <Typography variant="medium" type="secondary">
          We are giving away 50 Million SQT to our most valued community members in the SubQuery Seekers Program. Simply
          complete the challenges below - the more challenges you complete, the more SQT tokens you can earn!
        </Typography>
      </div>
      <Collapse className={styles.darkCollapse} ghost items={challenges} />
    </div>
  );
};

const Referral = (props: { userInfo?: IUserInfo }) => {
  const newReferralMultiple = Math.max(props.userInfo?.referral_count ?? 0, 1) + 1;
  return (
    <div
      className={styles.baseCard}
      style={{ display: 'flex', flexDirection: 'column', marginTop: 32, borderRadius: 8, gap: 16 }}
    >
      <Typography variant="h6">Refer a Friend to Multiply your Score!</Typography>
      <Typography type="secondary">
        When your friends sign up and onboard via your referral link, you both increase the multiplier on your score.
      </Typography>
      <Typography type="secondary">
        You&apos;ve already referred {props.userInfo?.referral_count || 0} new users. After your next referral, your new
        score multiplier will be {newReferralMultiple}x and your total points will increase to{' '}
        {((props.userInfo?.raw_score ?? 200) * newReferralMultiple).toLocaleString()}!
      </Typography>
      <Input
        className={styles.darkInput}
        value={`${rootUrl}/?referral=${props.userInfo?.referral_code}`}
        onChange={() => ({})}
      />

      <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 16 }}>
        <Button
          shape="round"
          ghost
          type="primary"
          size="large"
          style={{ flex: 1 }}
          onClick={() => {
            navigator.clipboard.writeText(`${rootUrl}/?referral=${props.userInfo?.referral_code}`);

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
          href={`mailto:yourfriend@email.com?subject=Join%20me%20on%20the%20SubQuery%20Seekers%2050%20Million%20SQT%20Challenge%20&body=Hi%20there%2C%0D%0A%0D%0AI%20recently%20joined%20the%20SubQuery%20Seekers%2050%20Million%20SQT%20challenge%20and%20I%20want%20to%20invite%20you%20too!%0D%0A%0D%0ASubQuery%20are%20giving%20away%2050%20Million%20SQT%20to%20their%20most%20valued%20community%20members%20in%20the%20SubQuery%20Seekers%20Program.%20Simply%20register%20for%20the%20campaign%20using%20this%20referral%20link%2C%20and%20start%20exploring%20the%20challenges.%20The%20more%20challenges%20we%20complete%2C%20the%20more%20SQT%20tokens%20we%20can%20earn!%20%F0%9F%A5%B3%0D%0A%0D%0AI%E2%80%99ve%20been%20having%20a%20blast%20so%20far%2C%20learning%20about%20SubQuery%2C%20blockchain%20data%20indexing%20and%20the%20overall%20web3%20infrastructure%20revolution%20they%20have%20planned.%0D%0A%0D%0AHere%E2%80%99s%20my%20invite%20link%20if%20you%20want%20to%20sign%20up%20and%20complete%20onboarding%20to%20instantly%20earn%20200%20points%3A%20https%3A%2F%2Fseekers.subquery.foundation%2F%3Freferral%3D${props.userInfo?.referral_code}%0D%0A%0D%0ASee%20you%20there!%20%F0%9F%91%80`}
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
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`@SubQueryNetwork is running the SubQuery Seekers campaign where you can complete fun quests to earn points and receive SQT tokens in their 50 million $SQT airdrop #SQTSeekers

Join me here to get a bonus: ${rootUrl}/?referral=${props.userInfo?.referral_code}`)}`}
        >
          <Button shape="round" ghost type="primary" size="large" style={{ width: '100%' }}>
            Post on X (Twitter)
          </Button>
        </a>
      </div>

      <ContactUs />
    </div>
  );
};

const Leaderboard = (props: { userInfo?: IUserInfo }) => {
  const { address: account } = useAccount();

  const { getUserLeaderboard } = useChallengesApi();

  const [userLeaderboard, setUserLeaderboard] = useState<LeaderboardSummary>();
  const initLeaderboard = async () => {
    if (!account) return;
    const res = await getUserLeaderboard(account);
    if (res.status === 200) {
      setUserLeaderboard(res.data);
    }
  };
  useEffect(() => {
    initLeaderboard();
  }, [account]);

  if (!userLeaderboard) return <DefaultLoading />;

  return (
    <div className={styles.baseCard} style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">The Leaderboard</Typography>
        <Typography variant="large">
          You are ranked {props.userInfo?.rank.toLocaleString()} of{' '}
          {userLeaderboard?.total_participants.toLocaleString()} participants
        </Typography>
      </div>
      <Typography type="secondary">Compete to get the highest score, you can do it!</Typography>

      <div style={{ display: 'flex', background: 'rgba(0, 0, 0, 0.23)', padding: 8, borderRadius: 8, gap: 16 }}>
        <div style={{ flex: 1, maxWidth: 60 }}>
          <Typography>#</Typography>
        </div>
        <div style={{ flex: 1 }}>
          <Typography>Name</Typography>
        </div>
        <div style={{ flex: 1 }}>
          <Typography>Referral Multiplier</Typography>
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
                <Typography type="secondary">{summary.referral_multiplier}x</Typography>
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

export const Challenges: FC<IProps> = (props) => {
  const { address: account } = useAccount();
  const [userInfo, setUserInfo] = useState<IUserInfo>();
  const [loading, setLoading] = useState(true);
  const { getUserInfo } = useChallengesApi();

  const userStage = useMemo(() => {
    if (!userInfo?.email) return 0;
    // if (userInfo.email && !userInfo.verified_email) return 1;
    return 2;
  }, [userInfo]);

  const fetchUserInfo = async () => {
    if (!account) return;
    try {
      setLoading(true);
      const res = await getUserInfo(account);

      if (res.status === 200) {
        setUserInfo(res.data);
      }
    } catch (e) {
      setUserInfo(undefined);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [account]);

  if (loading) return <DefaultLoading />;

  return (
    <>
      <div className={styles.baseCard}>
        {userStage === 0 && <FirstStep freshFunc={fetchUserInfo} />}
        {/* {userStage === 1 && <SecondStep />} */}
        {userStage === 2 && <MainChallenges />}
      </div>
      {userStage === 2 && (
        <>
          <Referral userInfo={userInfo} />
          <Leaderboard userInfo={userInfo} />
        </>
      )}
    </>
  );
};
export default Challenges;
