import { useState, VFC } from 'react';
import { useTranslation } from 'react-i18next';
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
    <>
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
          <a href="https://subquery.network/privacy" target="_blank" rel="noreferrer">
            <Button type="link" className={styles.linkText} label={t('subscription.privacy')} />
          </a>
          <Typography variant="small" className={styles.termsAndConditionsText}>{` ${t(
            'subscription.termsAndConditionsPart2'
          )}`}</Typography>
        </div>
      </div>
      <div className={styles.contact}>
        <span className={styles.contactText}>{t(`support.contact`)}</span>
      </div>
    </>
  );
};
