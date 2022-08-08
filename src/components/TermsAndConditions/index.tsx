// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { Typography } from '@subql/react-ui';
import { t } from 'i18next';
import remarkBreaks from 'remark-breaks';

import { AppContext } from '../../contextProvider';
import styles from './TermsAndConditions.module.css';

export const TermsAndConditions: React.VFC = () => {
  const { termsAndConditions } = React.useContext(AppContext);
  const sortedTermsAndConditions = termsAndConditions?.split('\n\n');
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Typography variant="h5" className={styles.tAndCTitle}>
          {t('termsAndConditions.title')}
        </Typography>

        {sortedTermsAndConditions?.map((p: string, idx: number) => (
          <div key={`${idx}`} className={styles.tAndC}>
            <ReactMarkdown children={p} remarkPlugins={[remarkBreaks]} />
          </div>
        ))}
      </div>
    </div>
  );
};
