/* eslint-disable camelcase */
import React from 'react'
// TODO: find a more programatic way to do this...
import { Popover } from 'antd'

import icon_1 from './icons/icon_1.svg'
import icon_2 from './icons/icon_2.svg'
import icon_3 from './icons/icon_3.svg'
import icon_4 from './icons/icon_4.svg'
import icon_5 from './icons/icon_5.svg'
import icon_6 from './icons/icon_6.svg'
import icon_7 from './icons/icon_7.svg'
import icon_8 from './icons/icon_8.svg'
import qrcode from './images/qrcode.png'
import styles from './style.module.css'

export const IconLinks: React.FC = () => {
  // const icons = []
  // for (let i = 1; i < 8; i++) {
    // icons.push('./icons/icon_' + i + '.svg')
  // }

  // for the weChat Popover
  const content = (
    <div className={styles.qrcode}>
      <img src={qrcode} alt="qrcode" />
      <p>Scan the QR code to join us</p>
    </div>
  )

  return (
    <div className={styles.icons}>
    {/* why isnt this img working? */}
    {/* <img src='./icons/icon_1.svg' alt='test' /> */}
      {/* {icons.map((icon, index) => (
        <img
          key={index}
          src={icon}
          // alt={'An icon link to a Subquery social media platform'}
          alt={icon}
          className={'icon'}
        />
      ))} */}

      {/* MAIL */}
      <a href='mailto:hello@subquery.network' target='_blank' rel="noreferrer">
        <img src={icon_1} alt='A social media icon' className={styles.icon} />
      </a>
      {/* WECHAT */}
      <Popover
        content={content}
        >
        <img src={icon_2} alt='A social media icon' className={styles.icon} />
      </Popover>
      {/* TWITTER */}
      <a href='https://twitter.com/subquerynetwork' target='_blank' rel="noreferrer">
        <img src={icon_3} alt='A social media icon' className={styles.icon} />
      </a>
      {/* MEDIUM */}
      <a href='https://medium.com/@subquery' target='_blank' rel="noreferrer">
        <img src={icon_4} alt='A social media icon' className={styles.icon} />
      </a>
      {/* GITHUB */}
      <a href='https://github.com/OnFinality-io/subql' target='_blank' rel="noreferrer">
        <img src={icon_5} alt='A social media icon' className={styles.icon} />
      </a>
      {/* YOUTUBE */}
      <a href='https://youtube.com/c/SubQueryNetwork' target='_blank' rel="noreferrer">
        <img src={icon_6} alt='A social media icon' className={styles.icon} />
      </a>
      {/* TELEGRAM */}
      {/* <a href='https://matrix.to/#/#subquery:matrix.org' target='_blank'> */}
      <a href='https://t.me/subquerynetwork' target='_blank' rel="noreferrer">
        <img src={icon_7} alt='A social media icon' className={styles.icon} />
      </a>
      {/* LINKEDIN */}
      <a href='https://www.linkedin.com/company/subquery' target='_blank' rel="noreferrer">
        <img src={icon_8} alt='A social media icon' className={styles.icon} />
      </a>
    </div>
  )
}