// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../contextProvider';
import styles from './TermsAndConditions.module.css';

export const TermsAndConditions: React.VFC = () => {
  const { termsAndConditions } = React.useContext(AppContext);
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.content}>{termsAndConditions}</div>
    </div>
  );
};
