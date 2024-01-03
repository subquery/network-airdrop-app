import React from 'react';
// TODO: find a more programatic way to do this...
import { Popover } from 'antd';

import icon1 from './icons/icon_1.svg';
import icon2 from './icons/icon_2.svg';
import icon3 from './icons/icon_3.svg';
import icon4 from './icons/icon_4.svg';
import icon5 from './icons/icon_5.svg';
import icon6 from './icons/icon_6.svg';
import icon7 from './icons/icon_7.svg';
import icon8 from './icons/icon_8.svg';
import styles from './style.module.less';

export const IconLinks: React.FC = () => {
  // const icons = []
  // for (let i = 1; i < 8; i++) {
  // icons.push('./icons/icon_' + i + '.svg')
  // }

  // for the weChat Popover
  const content = (
    <div className={styles.qrcode}>
      {/* <img src={qrcode} alt="qrcode" /> */}
      <img src="/images/qrcode.png" alt="qrcode" />
      <p>Scan the QR code to join us</p>
    </div>
  );

  return (
    <div className={styles.icons}>
      {/* MAIL */}
      <a href="mailto:hello@subquery.network" target="_blank" rel="noreferrer">
        <img src={icon1} alt="A social media icon" className={styles.icon} />
      </a>
      {/* WECHAT */}
      <Popover content={content}>
        <div>
          <img src={icon2} alt="A social media icon" className={styles.icon} width={40} height={40} />
        </div>
      </Popover>
      {/* TWITTER */}
      <a href="https://twitter.com/subquerynetwork" target="_blank" rel="noreferrer">
        <img src={icon3} alt="A social media icon" className={styles.icon} />
      </a>
      {/* MEDIUM */}
      <a href="https://medium.com/@subquery" target="_blank" rel="noreferrer">
        <img src={icon4} alt="A social media icon" className={styles.icon} />
      </a>
      {/* GITHUB */}
      <a href="https://github.com/OnFinality-io/subql" target="_blank" rel="noreferrer">
        <img src={icon5} alt="A social media icon" className={styles.icon} />
      </a>
      {/* YOUTUBE */}
      <a href="https://youtube.com/c/SubQueryNetwork" target="_blank" rel="noreferrer">
        <img src={icon6} alt="A social media icon" className={styles.icon} />
      </a>
      {/* TELEGRAM */}
      {/* <a href='https://matrix.to/#/#subquery:matrix.org' target='_blank'> */}
      <a href="https://t.me/subquerynetwork" target="_blank" rel="noreferrer">
        <img src={icon7} alt="A social media icon" className={styles.icon} />
      </a>
      {/* LINKEDIN */}
      <a href="https://www.linkedin.com/company/subquery" target="_blank" rel="noreferrer">
        <img src={icon8} alt="A social media icon" className={styles.icon} />
      </a>
    </div>
  );
};
