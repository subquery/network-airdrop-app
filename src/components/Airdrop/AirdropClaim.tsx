// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@subql/react-ui';
import useSWR from 'swr';
import styles from './AirdropClaim.module.css';
import { EmailSubscription } from '../EmailSubscription';
import { hooks } from '../../containers/metamask';
import { ACCOUNT_INFO_URL } from '../../constants/urls';
import { fetcher } from '../../utils';

export const AirdropClam: VFC = () => {
  const { t } = useTranslation();
  const { useAccounts } = hooks;
  const accounts = useAccounts();

  const { data: accountInfo, error: fetchError } =
    useSWR(accounts ? `${ACCOUNT_INFO_URL}/${accounts[0]}` : null, fetcher) || {};

  const { acalaTop100UserAirdrop, nftAirdrop, testnetAirdrop } = accountInfo || {};
  const tableTitles = [t('airdrop.category'), t('airdrop.amount'), t('airdrop.status')];
  const tableInfo = [
    {
      category: t('airdrop.testnetParticipant'),
      amount: `${testnetAirdrop} SQT`,
      status: t('airdrop.locked')
    },
    {
      category: t('airdrop.acalaTop100'),
      amount: `${acalaTop100UserAirdrop} SQT`,
      status: t('airdrop.locked')
    },
    {
      category: t('airdrop.addition'),
      amount: `X ${nftAirdrop} SubQuery NFT`,
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
          <div>{`${testnetAirdrop + acalaTop100UserAirdrop} SQT + ${nftAirdrop} NFT`}</div>
        </div>
        <div className={styles.airdropClaimDate}>
          <Typography className={styles.airdropClaimDateText}>{t('airdrop.claimDateTBA')}</Typography>
        </div>
      </div>
      <EmailSubscription />
    </div>
  );
};
