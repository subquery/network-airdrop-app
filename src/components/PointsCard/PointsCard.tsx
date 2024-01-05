import React, { FC, useEffect, useState } from 'react';
import { Typography } from '@subql/components';
import { useInterval } from 'ahooks';
import { useAccount } from 'wagmi';

import { IUserInfo, useChallengesApi } from 'hooks/useChallengesApi';

import styles from './index.module.less';

interface IProps {}

const PointsCard: FC<IProps> = () => {
  const { address: account } = useAccount();
  const { getUserInfo } = useChallengesApi();
  const [userInfo, setUserInfo] = useState<IUserInfo>();
  const initUserInfo = async () => {
    if (!account) return;
    const res = await getUserInfo(account);
    if (res.status === 200) {
      setUserInfo(res.data);
    }
  };
  useEffect(() => {
    initUserInfo();
  }, [account]);

  useInterval(() => {
    initUserInfo();
  }, 5000);

  return (
    <div className={styles.pointsCard}>
      <Typography>{userInfo?.total_score.toLocaleString() || 0} points</Typography>
      <Typography>{(userInfo?.referral_count || 0) + 1}x referral bouns</Typography>
      <Typography>Ranked # {userInfo?.rank || 0}</Typography>
    </div>
  );
};
export default PointsCard;
