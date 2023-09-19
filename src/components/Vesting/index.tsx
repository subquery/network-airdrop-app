import React, { FC, useEffect } from 'react';
import { Typography } from '@subql/components';
import { Button } from 'antd';

import { useWeb3 } from 'containers';
import { useContracts } from 'hooks';
import { formatAmount } from 'utils';

import styles from './index.module.less';

interface IProps {}

const Vesting: FC<IProps> = (props) => {
  const contracts = useContracts();
  const { account } = useWeb3();
  const claimSeries = () => {
    contracts?.vesting.claim;
  };

  const getClaimableAmount = async () => {
    if (!account || !contracts) return;
    const claimable = await contracts?.vesting.claimableAmount(account);
  };

  useEffect(() => {
    getClaimableAmount();
  }, [account, contracts]);

  return (
    <div className={styles.vesting}>
      <Typography variant="h6" weight={500}>
        Vesting
      </Typography>
      <Typography type="secondary" style={{ marginTop: 8 }}>
        Here you can see your vested token
      </Typography>

      <div className={styles.vestingHeader}>
        <div className={styles.vestingHeaderItem}>
          <Typography variant="large" style={{ color: '#fff' }}>
            Total Locked
          </Typography>
          <Typography variant="large" style={{ color: '#fff' }} weight={600}>
            {formatAmount(123121238102833)}
          </Typography>
        </div>
        <div className={styles.vestingHeaderItem}>
          <Typography variant="large" style={{ color: '#fff' }}>
            Total Claimed
          </Typography>
          <Typography variant="large" style={{ color: '#fff' }} weight={600}>
            {formatAmount(123121238102833)}
          </Typography>
        </div>
        <div className={styles.vestingHeaderItem}>
          <Typography variant="large" style={{ color: '#fff' }}>
            Available to Claim
          </Typography>
          <Typography variant="large" style={{ color: '#fff' }} weight={600}>
            {formatAmount(123121238102833)}
          </Typography>
        </div>
      </div>

      <div className={styles.vestingChunk}>
        <div className={styles.vestingChunkHeader}>
          <Typography variant="small" weight={600} style={{ color: 'var(--sq-gray700)' }}>
            SERIES A INVESTORS
          </Typography>

          <Button shape="round" type="primary">
            Claim Token
          </Button>
        </div>
        <div className={styles.vestingChunkContent}>
          <Typography style={{ color: 'var(--sq-gray700)' }}>
            1 year cliff with linear unlock over the next 48 months
          </Typography>

          <div className={styles.vestingChunkContentInfo}>
            <Typography>Locked: {formatAmount('1000000000000000000')}</Typography>
            <Typography>Claimed: {formatAmount('1000000000000000000')}</Typography>
            <Typography>Available to Claim: {formatAmount('1000000000000000000')}</Typography>
          </div>
        </div>
      </div>

      <div className={styles.vestingChunk}>
        <div className={styles.vestingChunkHeader}>
          <Typography variant="small" weight={600} style={{ color: 'var(--sq-gray700)' }}>
            PRIVATE SALE INVESTORS
          </Typography>

          <Button shape="round" type="primary">
            Claim Token
          </Button>
        </div>
        <div className={styles.vestingChunkContent}>
          <Typography style={{ color: 'var(--sq-gray700)' }}>
            1 year cliff with linear unlock over the next 48 months
          </Typography>

          <div className={styles.vestingChunkContentInfo}>
            <Typography>Locked: {formatAmount('1000000000000000000')}</Typography>
            <Typography>Claimed: {formatAmount('1000000000000000000')}</Typography>
            <Typography>Available to Claim: {formatAmount('1000000000000000000')}</Typography>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Vesting;
