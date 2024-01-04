import React, { FC } from 'react';
import { Typography } from '@subql/components';

import styles from './index.module.less';

interface IProps {}

const PointsCard: FC<IProps> = (props) => (
  <div className={styles.pointsCard}>
    <Typography>1,400 points</Typography>
    <Typography>1x referral bouns</Typography>
    <Typography>Ranked #1,113</Typography>
  </div>
);
export default PointsCard;
