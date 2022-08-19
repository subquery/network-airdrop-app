import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";

import Discord from "./images/discord.svg";
import { IconLinks } from "./components";
import styles from "./style.module.css";

export const Footer: React.FC = () => (
  <div className={styles.footerWrapper}>
    <div className={styles.footer}>
      <div className={styles.primaryRow}>
        <div className={styles.contact}>
          <h2>Join the Open Web3 Data Revolution</h2>
          <IconLinks />
        </div>

        <div className={styles.discord}>
          <Button
            type="primary"
            ghost
            shape="round"
            href="https://discord.com/invite/subquery"
            size="large"
          >
            <div className={styles.discordButton}>
              <img src={Discord} alt='discord' className={styles.discordButtonIcon} />
              <div>Join our active Discord community</div>
            </div>
          </Button>
        </div>
      </div>
      <div className={styles.secondaryRow}>
        <div className={styles.links}>
          <a href="https://subquery.network/privacy">Privacy Policy</a>
          <Link to="/terms-and-conditions">Airdrop Terms & Conditions</Link>
        </div>
        <div className={styles.copyright}>
          <small>SubQuery Foundation © 2022</small>
        </div>
      </div>
    </div>
  </div>
);
