import React from 'react';
import { Typography } from '@subql/components';
import { Button } from 'antd';

import { ReactComponent as Discord } from './images/discord.svg';
import { Email, IconLinks } from './components';
import styles from './style.module.less';

export const Footer: React.FC = () => (
  <div className={styles.footerWrapper}>
    <div className={styles.footer}>
      <div className={styles.footerLeft}>
        <Typography style={{ margin: 8 }}>
          <a href="https://subquery.foundation/">Home</a>
        </Typography>
        <Typography style={{ margin: 8 }}>
          <a href="https://subquery.foundation/sale">Public Sale</a>
        </Typography>
        <Typography style={{ margin: 8 }}>
          <a href="/">Airdrop</a>
        </Typography>

        <Typography style={{ margin: 8 }}>
          <a href="https://blog.subquery.network">Blog</a>
        </Typography>

        <Typography style={{ margin: 8 }}>
          <a href="https://subquery.network/">SubQuery Network Website</a>
        </Typography>
      </div>

      <span style={{ flex: 1 }} />

      <div className={styles.contact}>
        <Typography variant="large">Why you should sign up</Typography>
        <Typography variant="medium" style={{ margin: '8px 0 24px 0', color: 'var(--sq-gray100)' }}>
          Keep up to dates with new features, chain announcements, and case studies
        </Typography>

        <Email />

        <div style={{ margin: '24px 0' }}>
          <IconLinks />
        </div>

        <Button
          shape="round"
          size="large"
          type="primary"
          ghost
          href="https://discord.com/invite/subquery"
          icon={<Discord style={{ fontSize: 20, marginRight: 10 }} />}
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 0
          }}
        >
          Join our Active Discord Community
        </Button>
      </div>
    </div>

    <div
      style={{
        margin: '24px 0',
        height: 1,
        width: '100%',
        background: 'var(--dark-mode-border)'
      }}
    />

    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        maxWidth: 1280
      }}
    >
      <Typography style={{ color: 'var(--sq-gray500)' }}>SubQuery © 2023</Typography>
      <Typography style={{ color: 'var(--sq-gray500)', margin: '0 16px' }}>
        <a href="https://subquery.network/privacy" className={styles.externalLink}>
          Privacy Policy
        </a>
      </Typography>
      <Typography style={{ color: 'var(--sq-gray500)' }}>
        <a href="https://subquery.network/terms" className={styles.externalLink}>
          Terms of Service
        </a>
      </Typography>
    </div>
  </div>
);
