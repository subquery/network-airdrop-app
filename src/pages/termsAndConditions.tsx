import * as React from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { Typography } from '@subql/react-ui';
import remarkBreaks from 'remark-breaks';

import { AppContext } from 'contextProvider';

import styles from './termsAndConditions.module.css';

export const TermsAndConditions: React.VFC = () => {
  const { t } = useTranslation();
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
