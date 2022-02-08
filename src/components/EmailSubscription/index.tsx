// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, TextInput } from '@subql/react-ui';

import styles from './EmailSubscription.module.css';

export const EmailSubscription: VFC = () => {
  const { t } = useTranslation();
  //   const [email, setEmail] = useState<string>();

  return (
    <div className={styles.container}>
      <TextInput
        label={t('subscription.getNotified')}
        placeholder={t('subscription.enterEmail')}
        onChange={(e: any) => {}}
        className={styles.emailTextInput}
      />
      <Button
        type="primary"
        onClick={() => {}}
        label={t('subscription.subscribe')}
        className={styles.emailSubmitButton}
        size="medium"
      />
    </div>
  );
};
