// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, TextInput, Toast, Typography } from '@subql/react-ui';
import useSWR from 'swr';

import { EMAIL_SUSCRIBE_URL } from 'appConstants';
import { fetcherWithOps } from 'utils';

import styles from './EmailSubscription.module.css';

interface ToastBar {
  text?: string;
  state: 'success' | 'error';
}

export const EmailSubscription: VFC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>();
  const [onSubscribe, setOnSubscribe] = useState<boolean>();
  const [toastBar, setToastBar] = useState<ToastBar>();

  const postOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email
    })
  };

  const { data, error } = useSWR(onSubscribe ? EMAIL_SUSCRIBE_URL : null, fetcherWithOps(postOptions));

  if (data) {
    setToastBar({ text: 'You have successfully subscribed.', state: 'success' });
    setOnSubscribe(false);
  }

  return (
    <div className={styles.container}>
      <TextInput
        label={t('subscription.getNotified')}
        placeholder={t('subscription.enterEmail')}
        onChange={(e: any) => {
          setOnSubscribe(false);
          setEmail(e.target.value);
        }}
        className={styles.emailTextInput}
      />
      <Button
        type="primary"
        onClick={() => {
          setOnSubscribe(true);
        }}
        label={t('subscription.subscribe')}
        className={styles.emailSubmitButton}
        size="medium"
      />
      {toastBar && <Toast className={styles.toastBar} text={toastBar.text || ''} state={toastBar.state || ''} />}
      <div className={styles.termsAndConditions}>
        <Typography variant="small" className={styles.termsAndConditionsText}>
          {t('subscription.termsAndConditionsPart1')}
        </Typography>
        <Button
          type="link"
          className={styles.linkText}
          label={t('subscription.privacy')}
          onClick={() => navigate('/terms-and-conditions')}
        />
        <Typography variant="small" className={styles.termsAndConditionsText}>{` ${t(
          'subscription.termsAndConditionsPart2'
        )}`}</Typography>
      </div>
    </div>
  );
};
