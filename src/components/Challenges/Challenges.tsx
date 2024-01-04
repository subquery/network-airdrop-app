import React, { FC, useMemo } from 'react';
import { IoMdCheckmark } from 'react-icons/io';
import { MdOutlineMail } from 'react-icons/md';
import { Markdown, Typography } from '@subql/components';
import { Button, Collapse, Input } from 'antd';
import clsx from 'clsx';
import { useAccount } from 'wagmi';

import styles from './index.module.less';

interface IProps {}

const ContactUs = () => (
  <div style={{ width: '100%', textAlign: 'center' }}>
    <Typography type="secondary">
      If you have any issues or questions, contact us on the{' '}
      <Typography.Link active href="https://subquery.network/privacy" variant="medium">
        #airdrop-support
      </Typography.Link>{' '}
      channel on our Discord
    </Typography>
  </div>
);

const FirstStep = () => {
  const { address: account } = useAccount();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Typography variant="h6">SubQuery’s 50 Million SQT Airdrop Challenge</Typography>
        <Typography variant="medium" type="secondary">
          We are giving away 50 Million SQT to our most valued community members in our largest airdrop yet!
        </Typography>
      </div>
      <Input className={styles.darkInput} placeholder={account} disabled />

      <Typography variant="medium" type="secondary" style={{ maxWidth: 806 }}>
        Enter your email address so we can send you important information about the 50 Million SQT Airdrop Challenge and
        so we can complete KYC when the program finishes.
      </Typography>

      <Input className={styles.darkInput} placeholder="Enter your email" />

      <Typography variant="medium" type="secondary">
        By entering your email you acknowledge and consent to our{' '}
        <Typography.Link active href="https://subquery.network/privacy" variant="medium">
          privacy policy
        </Typography.Link>
      </Typography>

      <Button type="primary" shape="round" size="large">
        Submit
      </Button>

      <ContactUs />
    </div>
  );
};

const SecondStep = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
    <MdOutlineMail style={{ fontSize: '100px', color: '#fff' }} />
    <Typography variant="h6">SubQuery&apos;s 50 Million SQT Airdrop Challenge</Typography>
    <Typography variant="medium" type="secondary">
      We are giving away 50 Million SQT to our most valued community members in our largest airdrop yet!
    </Typography>
    <Typography type="secondary" style={{ maxWidth: 806, textAlign: 'center', padding: '0 3em' }}>
      We’ve just sent an onboarding email to your email address (james.bayly@subquery.network). Go and click on the link
      in it to continue!
    </Typography>
    <ContactUs />
  </div>
);

const MainChallenges = () => {
  const { address: account } = useAccount();
  const challenges = useMemo(() => {
    const p = '123123';
    return [
      {
        key: '1',
        label: (
          <div style={{ display: 'flex', alignItems: 'center', marginRight: 10 }}>
            <div className={clsx(styles.check, styles.checkActive)}>
              <IoMdCheckmark style={{ fontSize: 21 }} />
            </div>
            <Typography variant="large">Reach Level 2 on Zealy</Typography>

            <span style={{ flex: 1 }} />

            <Typography>+400 Points!</Typography>
          </div>
        ),
        children: (
          <div>
            <Markdown.Preview>{'# fff   '}</Markdown.Preview>

            <a href="https://www.baidu.com">
              <Button shape="round" size="large" type="primary" style={{ marginTop: 16, width: '100%' }}>
                Sign up to Galxe and
              </Button>
            </a>
          </div>
        )
      },
      {
        key: '2',
        label: 'This is panel2',
        children: <div>1231232</div>
      }
    ];
  }, []);
  return <Collapse className={styles.darkCollapse} ghost items={challenges} />;
};

const Referral = () => {
  const { address: account } = useAccount();

  return (
    <div
      className={styles.baseCard}
      style={{ display: 'flex', flexDirection: 'column', marginTop: 32, borderRadius: 8, gap: 16 }}
    >
      <Typography variant="h6">Refer a Friend to Multiply your Score!</Typography>
      <Typography type="secondary">
        When your friend signs up and onboards with your referral link, you both increase the multiplier on your score.
      </Typography>
      <Typography type="secondary">
        After your next referral, your score multiplier will be 2x and your total points will increase to 2,800!
      </Typography>
      <Input className={styles.darkInput} value={account} onChange={() => ({})} />

      <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 16 }}>
        <Button shape="round" ghost type="primary" size="large" style={{ flex: 1 }}>
          Copy your referral link
        </Button>
        <Button shape="round" ghost type="primary" size="large" style={{ flex: 1 }}>
          Send as email
        </Button>
        <Button shape="round" ghost type="primary" size="large" style={{ flex: 1 }}>
          Post on X (Twitter)
        </Button>
      </div>

      <ContactUs />
    </div>
  );
};

const Leaderboard = () => {
  const { address: account } = useAccount();

  return (
    <div className={styles.baseCard} style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Typography variant="h6">The Leaderboard</Typography>
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
        <div className={styles.tableItem}>
          <div style={{ flex: 1, maxWidth: 60 }}>
            <Typography type="secondary">99999</Typography>
          </div>
          <div style={{ flex: 1 }}>
            <Typography tooltip={account} type="secondary">
              {`${account?.slice(0, 5)}...${account?.slice(account.length - 6, account.length - 1)}`}
            </Typography>
          </div>

          <div style={{ flex: 1 }}>
            <Typography type="secondary">8x</Typography>
          </div>

          <div style={{ flex: 1 }}>
            <Typography type="secondary">{Number(99999).toLocaleString()} points</Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Challenges: FC<IProps> = (props) => {
  const { address: account } = useAccount();

  return (
    <>
      <div className={styles.baseCard}>
        {/* <FirstStep /> */}
        {/* <SecondStep /> */}
        <MainChallenges />
      </div>

      <Referral />
      <Leaderboard />
    </>
  );
};
export default Challenges;
