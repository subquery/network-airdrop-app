/* eslint-disable camelcase */
import React from 'react';

// TODO: find a more programatic way to do this...
import styles from './style.module.css';

export const IconLinks: React.FC = () => (
  <div className={styles.icons}>
    {/* MAIL */}
    <a href="mailto:hello@subquery.network" target="_blank" rel="noreferrer">
      <img src="/static/icons/icon_1.svg" alt="A social media icon" className={styles.icon} />
    </a>
    {/* TWITTER */}
    <a href="https://twitter.com/subquerynetwork" target="_blank" rel="noreferrer">
      <img src="/static/icons/icon_3.svg" alt="A social media icon" className={styles.icon} />
    </a>
    {/* MEDIUM */}
    <a href="https://medium.com/@subquery" target="_blank" rel="noreferrer">
      <img src="/static/icons/icon_4.svg" alt="A social media icon" className={styles.icon} />
    </a>
    {/* GITHUB */}
    <a href="https://github.com/OnFinality-io/subql" target="_blank" rel="noreferrer">
      <img src="/static/icons/icon_5.svg" alt="A social media icon" className={styles.icon} />
    </a>
    {/* YOUTUBE */}
    <a href="https://youtube.com/c/SubQueryNetwork" target="_blank" rel="noreferrer">
      <img src="/static/icons/icon_6.svg" alt="A social media icon" className={styles.icon} />
    </a>
    {/* TELEGRAM */}
    {/* <a href='https://matrix.to/#/#subquery:matrix.org' target='_blank'> */}
    <a href="https://t.me/subquerynetwork" target="_blank" rel="noreferrer">
      <img src="/static/icons/icon_7.svg" alt="A social media icon" className={styles.icon} />
    </a>
    {/* LINKEDIN */}
    <a href="https://www.linkedin.com/company/subquery" target="_blank" rel="noreferrer">
      <img src="/static/icons/icon_8.svg" alt="A social media icon" className={styles.icon} />
    </a>
  </div>
);
