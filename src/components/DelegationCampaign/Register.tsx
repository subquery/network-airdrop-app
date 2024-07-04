import { useMemo, useState } from 'react';
import { MdOutlineMail } from 'react-icons/md';
import { useLocation } from 'react-router-dom';
import { openNotification, Typography } from '@subql/components';
import { Button, Form, Input } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useAccount as useAccountWagmi } from 'wagmi';

import { ContactUs } from 'components/WalletDetect/WalletDetect';
import { IDelegationUserInfo, useDelegationCampaignApi } from 'hooks/useDelegationCampaignApi';

import styles from './DelegationCampaign.module.less';

const rootUrl = new URL(window.location.href).origin || 'https://frenzy.subquery.foundation';

const useAccount = () => {
  const p = useAccountWagmi();

  return {
    ...p,
    address: new URL(window.location.href).searchParams.get('customAddress') || p.address
  };
};

export const FirstStep = (props: { userInfo?: IDelegationUserInfo['data']; refresh: () => void }) => {
  const { userInfo, refresh } = props;

  const { search } = useLocation();
  const { address: account } = useAccount();
  const query = useMemo(() => new URLSearchParams(search), [search]);
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const { signup, sendVerifyEmail } = useDelegationCampaignApi({
    alert: true
  });

  const haveSubmitEmial = useMemo(() => {
    if (!userInfo?.email) return false;
    return true;
  }, [userInfo]);

  const signupWithCode = async () => {
    try {
      setLoading(true);
      await form.validateFields();
      if (!account) return false;
      const referralCode = query.get('referral') || '';

      const res = await signup({
        wallet: account,
        referralCode: referralCode || undefined,
        email: form.getFieldValue('email')
      });

      await refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 48, marginTop: 80 }}>
      <Typography variant="h3" style={{ width: 600, textAlign: 'center' }}>
        SubQuery Summer Delegation Frenzy
      </Typography>
      <div className={styles.actionModal}>
        {!haveSubmitEmial && (
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
                Please verify your email address to register for the Summer Delegation Frenzy
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
        )}

        {/* second step */}

        {haveSubmitEmial && (
          <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 16 }}>
            <MdOutlineMail style={{ fontSize: '47px', color: '#fff' }} />
            <Typography variant="h5">Email Verification</Typography>
            <Typography type="secondary" style={{ textAlign: 'center' }}>
              We’ve just sent an onboarding email to your email address ({userInfo?.email})
            </Typography>
            <Typography type="secondary" style={{ textAlign: 'center' }}>
              Click the link on the email you have received from us, make sure to check for it in your spam!
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Typography type="secondary" style={{ textAlign: 'center' }}>
                Didn&apos;t receive an email?{' '}
                <Typography.Link
                  onClick={async () => {
                    const res = await sendVerifyEmail({ wallet: account || '' });
                    if (res.data.code === 0) {
                      openNotification({
                        type: 'success',
                        description:
                          'We have sent you a new verification link, please check your email address (including your spam account)',
                        duration: 10
                      });
                    }
                  }}
                  type="info"
                >
                  Request another one
                </Typography.Link>
              </Typography>
            </div>
          </div>
        )}

        <ContactUs mode="delegationCampaign" />
      </div>
    </div>
  );
};
