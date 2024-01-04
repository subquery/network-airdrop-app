import React, { FC, useState } from 'react';
import { Typography } from '@subql/components';
import { useMount } from 'ahooks';
import { useAccount } from 'wagmi';

import { IUserInfo, useChallengesApi } from 'hooks/useChallengesApi';

import styles from './index.module.less';

interface IProps {}

const PointsCard: FC<IProps> = () => {
  const { address: account } = useAccount();
  const { getUserInfo } = useChallengesApi();
  const [userInfo, setUserInfo] = useState<IUserInfo>();

  useMount(async () => {
    if (!account) return;
    const res = await getUserInfo(account);
    if (res.status === 200) {
      setUserInfo(res.data);
    }
  });

  return (
    <div className={styles.pointsCard}>
      <Typography>{userInfo?.total_score.toLocaleString() || 0} points</Typography>
      <Typography>{userInfo?.referral_count || 0}x referral bouns</Typography>
      <Typography>Ranked #{userInfo?.rank || 0}</Typography>
    </div>
  );
};
export default PointsCard;
