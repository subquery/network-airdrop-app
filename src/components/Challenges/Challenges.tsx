import React, { FC, useEffect, useMemo, useState } from 'react';
import { IoMdCheckmark } from 'react-icons/io';
import { MdOutlineMail } from 'react-icons/md';
import { Markdown, openNotification, Spinner, Typography } from '@subql/components';
import { Button, Collapse, Input, Modal } from 'antd';
import clsx from 'clsx';
import { useAccount as useAccountWagmi } from 'wagmi';

import { ContactUs } from 'components/WalletDetect/WalletDetect';
import { Challenge, IUserInfo, LeaderboardSummary, useChallengesApi } from 'hooks/useChallengesApi';

import styles from './index.module.less';

interface IProps {}

const rootUrl = new URL(window.location.href).origin || 'https://seekers.subquery.network';

const useAccount = () => {
  const p = useAccountWagmi();

  return {
    ...p,
    address: new URL(window.location.href).searchParams.get('account') || p.address
  };
};

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

// eslint-disable-next-line
const FirstStep = () => {
  /*
  const { search } = useLocation();
  const { address: account } = useAccount();
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
  */

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Typography variant="h6">SubQuery Seekers 50 Million SQT Challenge has now closed!</Typography>
        <Typography variant="medium" type="secondary">
          After an incredible 3 months, the SubQuery Seekers program, came to a close on 10th April 2024. The 50 million
          SQT reward pool will be divided and distributed proportionately to all eligible participants on Tuesday 16th
          of April 2024.
        </Typography>
      </div>
      {/*
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
        */}

      <ContactUs />
    </div>
  );
};

const SecondStep = () => {
  const { address: account } = useAccount();
  const { sendEmail } = useChallengesApi();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <MdOutlineMail style={{ fontSize: '100px', color: '#fff' }} />
      <Typography variant="h6">SubQuery Seekers 50 Million SQT Challenge</Typography>
      <Typography variant="h6">SubQuery Seekers 50 Million SQT Challenge has now closed!</Typography>
      <Typography variant="medium" type="secondary">
        After an incredible 3 months, the SubQuery Seekers program, came to a close on 10th April 2024. The 50 million
        SQT reward pool will be divided and distributed proportionately to all eligible participants on Tuesday 16th of
        April 2024.
      </Typography>
      <Typography type="secondary" style={{ maxWidth: 806, textAlign: 'center', padding: '0 3em' }}>
        We have sent an onboarding email to your email address, if you didn&apos;t get it, you can{' '}
        <Typography.Link
          active
          style={{ textDecoration: 'underline' }}
          onClick={async () => {
            await sendEmail(account);
            openNotification({
              type: 'success',
              description:
                'We have sent you a new verification link, please check your email address (including your spam account)',
              duration: 10
            });
          }}
        >
          request another one
        </Typography.Link>
        .
      </Typography>
      <Typography variant="medium" type="secondary">
        Go and click on the link in it to continue! (check for it in your spam)
      </Typography>
      <ContactUs />
    </div>
  );
};

const MainChallenges = (props: { userInfo?: IUserInfo }) => {
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

            {challenge.id === 0 ? (
              // This is the KYC challenge
              <Typography>{challenge.success ? 'KYC Complete!' : 'KYC Incomplete'}</Typography>
            ) : challenge.reward_type === 'FIXED' ? (
              <Typography>+{challenge.reward} Points!</Typography>
            ) : (
              <Typography>+{challenge.reward} Points for each challenge finished!</Typography>
            )}
          </div>
        ),
        children: (
          <div className={styles.markdownWrapper}>
            <Markdown.Preview>{challenge.description}</Markdown.Preview>
            {/*
            {challenge.cta && (
              <a href={challenge.cta} target="_blank" rel="noreferrer">
                <Button shape="round" size="large" type="primary" style={{ marginTop: 16, width: '100%' }}>
                  {challenge.cta_label}
                </Button>
              </a>
            )}
          */}
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
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const challenges: Challenge[] = res.data;
        challenges.push({
          id: 0,
          name: 'Complete KYC for your account',
          success: props.userInfo?.has_kyc || false,
          reward: 0,
          reward_type: 'FIXED',
          description: `You must complete KYC for your account in order to receive any rewards, click Start KYC and ensure that you complete KYC with the same wallet and email address as you are using for your Seekers account.
        
          You must pass KYC with the wallet address that you are using (${props.userInfo?.address}) 
          and your email address (${props.userInfo?.email}).
          Please note, we sync this challenge every hour so please be patient and your progress will automatically update.`,
          cta: 'https://in.sumsub.com/idensic/l/#/uni_cJnVIbYwk7jHnjtK', // TODO
          cta_label: 'Start KYC',
          sort_order: 0
        });
        challenges.push({
          id: -1,
          name: 'Sign Up Bonus',
          success: props.userInfo?.has_kyc || false,
          reward: 200,
          reward_type: 'FIXED',
          description:
            'All new users for the SubQuery Seekers program that verify their email get 200 points to start!',
          cta: '', // TODO
          cta_label: '',
          sort_order: 1
        });
        setUserChallenges(challenges.sort((a, b) => (a.sort_order < b.sort_order ? -1 : 1)) || []);
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
        <Typography variant="h6">SubQuery Seekers 50 Million SQT Challenge has now closed!</Typography>
        <Typography variant="medium" type="secondary">
          After an incredible 3 months, the SubQuery Seekers program, came to a close on 10th April 2024. The 50 million
          SQT reward pool will be divided and distributed proportionately to all eligible participants on Tuesday 16th
          of April 2024.
        </Typography>
      </div>
      <Collapse className={styles.darkCollapse} ghost items={challenges} />
    </div>
  );
};

const Referral = (props: { userInfo?: IUserInfo }) => {
  const newReferralMultiple = Math.max(props.userInfo?.kyc_referral_count ?? 0, 1) + 1;
  return (
    <div
      className={styles.baseCard}
      style={{ display: 'flex', flexDirection: 'column', marginTop: 32, borderRadius: 8, gap: 16 }}
    >
      <Typography variant="h6">Refer a Friend to Multiply your Score!</Typography>
      <Typography type="secondary">
        When your friends sign up, onboard, and pass KYC via your referral link, you both increase the multiplier on
        your score.
      </Typography>
      <Typography type="secondary">
        You&apos;ve already referred {props.userInfo?.referral_count || 0} new users, of these{' '}
        {props.userInfo?.kyc_referral_count || 0} new users are &quot;eligible participants&quot; (e.g. have passed KYC
        - check the FAQs below) and are counted to your referral multiple. After your next referral, your new score
        multiplier will be {newReferralMultiple}x and your total points will increase to{' '}
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
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`@SubQueryNetwork is running the SubQuery Summer Delegation Frenzy campaign where you can delegate to earn points and receive SQT tokens #SQTSummerFrenzy

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
    <div
      className={styles.baseCard}
      style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}
    >
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
          <Typography>Verified Referral Multiplier</Typography>
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
    if (!userInfo) return 0;
    if (!userInfo.verified_email) return 1;
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

  useEffect(() => {
    let closeModal: {
      destroy: () => void;
    };
    if (userStage === 2 && !userInfo?.has_kyc) {
      closeModal = Modal.info({
        title: 'You have not yet passed KYC',
        content: `If you want to receive any rewards from the SubQuery Seekers challenge, you must pass KYC before the end of the program on the 10th of April.
        
        You must pass KYC with the wallet address that you are using (${userInfo?.address}) and your email address (${userInfo?.email}).`,
        okButtonProps: {
          type: 'primary',
          shape: 'round',
          size: 'large'
        },
        closable: true,
        okText: 'Complete KYC Process',
        onOk: () => {
          window.open('https://in.sumsub.com/idensic/l/#/uni_cJnVIbYwk7jHnjtK', '_blank');
        },
        maskClosable: true,
        className: styles.kycModal
      });
    }

    return () => {
      closeModal?.destroy();
    };
  }, [userStage, userInfo]);

  if (loading) return <DefaultLoading />;

  return (
    <>
      <div className={styles.baseCard}>
        {userStage === 0 && <FirstStep />}
        {userStage === 1 && <SecondStep />}
        {userStage === 2 && <MainChallenges userInfo={userInfo} />}
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
