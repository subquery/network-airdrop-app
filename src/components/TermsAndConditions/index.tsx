// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Typography } from '@subql/react-ui';
import { t } from 'i18next';
import * as React from 'react';
import { AppContext } from '../../contextProvider';
import styles from './TermsAndConditions.module.css';

export const TermsAndConditions: React.VFC = () => {
  const { termsAndConditions } = React.useContext(AppContext);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Typography variant="h5">{t('termsAndConditions.title')}</Typography>
        {termsAndConditions}
      </div>
    </div>
  );
};
