/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleOutlined } from '@ant-design/icons';
import { Typography } from '@subql/components';
import { Input, message } from 'antd';

import enterImage from './images/enter.svg';
import styles from './style.module.less';

const sendEmail = async (email: string) =>
  fetch('https://signup.subquery.network/subscribe', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email
    })
  });

const EnterButton: React.FC<{ onClick: () => void }> = (props) => (
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events
  <div onClick={props.onClick}>
    <img loading="lazy" alt="" src={enterImage} className={styles.inputSuffix} width={32} height={32} />
  </div>
);
export const Email: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [isSubmit, setIsSubmit] = React.useState(false);
  const [isSubmitSuccess, setIsSubmitSuccess] = React.useState(false);
  const handleChange = (e: any) => {
    setEmail(e.target.value);
  };
  const handleEnter = async () => {
    if (isSubmit) return;
    if (!/^[A-Za-z0-9]+([-_.][A-Za-z0-9]+)*@([A-Za-z0-9]+[-.])+[A-Za-z0-9]{2,5}$/.test(email)) {
      message.error('Please enter a correct email address!');
      return;
    }
    setIsSubmit(true);
    try {
      await sendEmail(email);
      setIsSubmit(false);
      setIsSubmitSuccess(true);
      setEmail('');
    } catch (e) {
      setIsSubmit(false);
      console.error(e);
      throw e;
    }
  };

  return (
    <div className={styles.email}>
      <Input
        className={styles.emailInput}
        placeholder="Enter your email"
        size="large"
        value={email}
        suffix={<EnterButton onClick={handleEnter} />}
        onPressEnter={handleEnter}
        onChange={handleChange}
        disabled={isSubmit}
      />
      <Typography className={styles.small} style={{ color: 'var(--sq-gray500)' }} variant="medium">
        By entering your email you agree and have read to our&nbsp;
        <Link to="/privacy" target="_blank" style={{ color: 'var(--sq-blue600)' }}>
          privacy policy
        </Link>
      </Typography>
      {isSubmitSuccess ? (
        <p className={styles.success}>
          <CheckCircleOutlined style={{ marginRight: 8 }} />
          Thanks for subscribing to our newsletter!
        </p>
      ) : null}
    </div>
  );
};
