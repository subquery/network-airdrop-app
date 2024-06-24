import React, { FC } from 'react';
import clsx from 'clsx';

import styles from './LootboxAnimation.module.less';

interface IProps {}

const LootboxAnimation: FC<IProps> = (props) => (
  <div>
    {/* <svg width="24px" height="24px" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <svg id="heart" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path d="M12 4.419c-2.826-5.695-11.999-4.064-11.999 3.27 0 7.27 9.903 10.938 11.999 15.311 2.096-4.373 12-8.041 12-15.311 0-7.327-9.17-8.972-12-3.27z"></path>
        </svg>
      </defs>
    </svg>
    <svg style={{ position: 'absolute' }} width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <use x="50%" y="10%" href="#heart" width="24px" height="24px" fill="red">
        <animateMotion path="M 0 0 L -30 30" begin="0s" dur="1s" repeatCount="indefinite"></animateMotion>
      </use>
    </svg> */}

    <div className={clsx(styles.boxGroup, 'animate__animated', 'animate__fadeIn')}>
      <img className={styles.boxTop} src="/static/box-top.png" alt=""></img>
      <img className={styles.boxBottom} src="/static/box-bottom.png" alt=""></img>
      <img className={styles.boxCoin} src="/static/coin.png" alt=""></img>
      <img className={styles.boxCoin2} src="/static/coin-2.png" alt=""></img>
    </div>
  </div>
);
export default LootboxAnimation;
