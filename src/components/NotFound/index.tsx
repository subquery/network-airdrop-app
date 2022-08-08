// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@subql/react-ui';

import styles from './NotFound.module.css';

export const NotFound: React.VFC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Typography variant="h3" className={styles.title}>
          {t('error.404')}
        </Typography>
        <Typography variant="h3" className={styles.title}>
          {t('error.pageNotFound')}
        </Typography>
      </div>
    </div>
  );
};
