// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@subql/react-ui';
import styles from './AirdropClaim.module.css';
import { EmailSubscription } from '../EmailSubscription';

export const AirdropClam: VFC = () => {
  const [testnetAirdrop, setTestnetAirdrop] = useState<number>(0);
  const [acalaAirdrop, setAcalaAirdrop] = useState<number>(0);
  const [additionAirdrop, setAdditionAirdrop] = useState<number>(0);

  const { t } = useTranslation();

  const tableTitles = [t('airdrop.category'), t('airdrop.amount'), t('airdrop.status')];
  const tableInfo = [
    {
      category: t('airdrop.testnetParticipant'),
      amount: `${testnetAirdrop} SQT`,
      status: t('airdrop.locked')
    },
    {
      category: t('airdrop.acalaTop100'),
      amount: `${acalaAirdrop} SQT`,
      status: t('airdrop.locked')
    },
    {
      category: t('airdrop.addition'),
      amount: `${additionAirdrop} SQT`,
      status: t('airdrop.locked')
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.airdropClaimBoard}>
        <div>
          <Typography className={styles.title} variant="h6">
            {t('airdrop.yourAirDrop')}
          </Typography>
        </div>
        <div className={styles.content}>
          <div className={styles.tableTitle}>
            {tableTitles.map((title, index) => (
              <div className={index === 0 ? styles.category : ''} key={title}>
                {title.toUpperCase()}
              </div>
            ))}
          </div>
          <div className={styles.divisionLine} />
          <div>
            {tableInfo.map((info) => (
              <div className={styles.tableContent} key={info.category}>
                <div className={styles.category}>{info.category}</div>
                <div>{info.amount}</div>
                <div>{info.status}</div>
              </div>
            ))}

            <div className={styles.airdropClaimImg}>
              <img src="static/airdropClaim.png" alt="airdrop page img" />
            </div>
          </div>
        </div>
        <div className={styles.airdropClaimAmount}>
          <div>{t('airdrop.total')}</div>
          <div>{`${testnetAirdrop + acalaAirdrop} SQT + ${additionAirdrop} NFT`}</div>
        </div>
        <div className={styles.airdropClaimDate}>
          <Typography className={styles.airdropClaimDateText}>
            {t('airdrop.claimDateTBA')}
          </Typography>
        </div>
      </div>
      <EmailSubscription />
    </div>
  );
};
