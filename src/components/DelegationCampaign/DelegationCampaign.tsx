import React, { FC, useMemo, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
// import { MdOutlineMail } from 'react-icons/md';
import { useLocation } from 'react-router-dom';
import { Typography } from '@subql/components';
import { useAsyncMemo } from '@subql/react-hooks';
import { Button, Form, Input } from 'antd';
import { useForm } from 'antd/es/form/Form';
import clsx from 'clsx';
import { useAccount } from 'wagmi';

import { ContactUs, WalletDetect } from 'components/WalletDetect/WalletDetect';
import { useDelegationCampaignApi } from 'hooks/useDelegationCampaignApi';

import styles from './DelegationCampaign.module.less';

interface IProps {}

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
      </div>
    </div>
  );
};

export default DelegationCampaign;
