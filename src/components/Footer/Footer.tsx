import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

import Discord from './images/discord.svg';
import { IconLinks } from './components';
import styles from './style.module.css';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.footerWrapper}>
      <div className={styles.footer}>
        <div className={styles.primaryRow}>
          <div className={styles.contact}>
            <h2>Join the Open Web3 Data Revolution</h2>
            <div className={styles.contacts}>
              <IconLinks />

              <Button type="primary" ghost shape="round" href="https://discord.com/invite/subquery" size="large">
                <div className={styles.discordButton}>
                  <img src={Discord} alt="discord" className={styles.discordButtonIcon} />
                  <div>{t(`footer.discord`)}</div>
                </div>
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.secondaryRow}>
          <div className={styles.links}>
            <a href="https://subquery.network/privacy">{t(`footer.privacy`)}</a>
            <Link to="/terms-and-conditions">{t(`footer.termsAndConditions`)}</Link>
          </div>
          <div className={styles.copyright}>
            <small>{t(`footer.copyright`)}</small>
          </div>
        </div>
      </div>
    </div>
  );
};
