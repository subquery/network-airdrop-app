// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Typography } from '@subql/react-ui';
import { useWeb3 } from '../../containers';
import { injectedConntector } from '../../containers/Web3';
import styles from './Airdrop.module.css';
import { AirdropClam } from './AirdropClaim';

const AskWalletConnection = ({ handClick, t }: any) => (
  <div className={styles.walletActionContainer}>
    <Typography className={styles.walletActionTitle}>{t('airdrop.eligible')}</Typography>
    <Typography className={styles.walletActionTitle}>{t('airdrop.connectWallet')}</Typography>

    <button onClick={handClick} type="button" className={styles.walletActionButton}>
      <img src="/static/metamaskBanner.png" className={styles.logo} alt="Metamask logo" />
      <Typography className={styles.walletActionText}>
        {t('airdrop.connectBrowserWallet')}
      </Typography>
    </button>
  </div>
);

const AskWalletSignTC = ({ handClick, t }: any) => (
  <div className={styles.walletActionContainer}>
    <div>
      <Typography className={styles.walletActionTitle}>{t('airdrop.agreeWith')}</Typography>
      <a href="/" target="_blank" className={styles.linkText}>
        {` Terms and Conditions `}
      </a>

      <Typography className={styles.walletActionTitle}>{t('airdrop.signature')}</Typography>
      <Typography className={styles.walletActionTitle}>{t('airdrop.doOnce')}</Typography>
    </div>

    <Button
      className={styles.walletSignButton}
      label={t('airdrop.signOnMetamask')}
      onClick={handClick}
    />
  </div>
);

export const Airdrop: VFC = () => {
  const [TCSigned, setTCsigned] = useState<boolean>(false);
  const { account, active, activate, library } = useWeb3();
  const { t } = useTranslation();

  useEffect(() => {
    setTCsigned(false);
  }, []);

  useEffect(() => {
    if (!active) {
      setTCsigned(false);
    }
  }, [active]);

  const handleConnectWallet = async () => {
    try {
      await activate(injectedConntector);
    } catch (e) {
      console.log('Failed to activate wallet', e);
    }
  };

  const handleSignWallet = async () => {
    try {
      const signResult = await library
        ?.getSigner()
        .signMessage('Sign this message to agree with the Terms & Conditions.');

      console.log('signResult', signResult);
      setTCsigned(true);
    } catch (e) {
      console.log('Failed to sign the wallet', e);
    }
  };

  const toConnectWallet = !account;
  const toSignWallet = account && !TCSigned;
  const signedWallet = account && TCSigned;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {!signedWallet && (
          <div className={styles.titleContainer}>
            <Typography variant="h3" className={styles.title}>
              {t('airdrop.check')}
            </Typography>
          </div>
        )}

        {!signedWallet && <img src="static/airdropImg.svg" alt="airdrop page img" />}

        <div className={styles.airdropDetails}>
          {toConnectWallet && <AskWalletConnection handClick={handleConnectWallet} t={t} />}
          {toSignWallet && <AskWalletSignTC handClick={handleSignWallet} t={t} />}
          {signedWallet && <AirdropClam />}
        </div>
        <div>
          <Typography className={styles.supportText}>
            {`${t('support.contact')} `}
            <a href="/" className={styles.linkText} target="_blank">
              Discord.
            </a>
          </Typography>
        </div>
      </div>
    </div>
  );
};
