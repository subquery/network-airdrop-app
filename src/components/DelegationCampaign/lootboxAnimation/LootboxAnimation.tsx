import React, { FC } from 'react';
import clsx from 'clsx';

import styles from './LootboxAnimation.module.less';

interface IProps {}

const LootboxAnimation: FC<IProps> = (props) => (
  <div className={clsx(styles.boxGroup, 'animate__animated', 'animate__fadeIn')}>
    <img className={styles.boxTop} src="/static/box-top.png" alt=""></img>
    <img className={styles.boxBottom} src="/static/box-bottom.png" alt=""></img>
    <img className={styles.boxCoin} src="/static/coin.png" alt=""></img>
    <img className={styles.boxCoin2} src="/static/coin-2.png" alt=""></img>
  </div>
);
export default LootboxAnimation;
