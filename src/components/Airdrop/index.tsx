// // Copyright 2020-2021 OnFinality Limited authors & contributors
// // SPDX-License-Identifier: Apache-2.0

import { useEffect, useState, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Typography, Toast } from '@subql/react-ui';
import { useNavigate } from 'react-router-dom';
import { hooks, metaMask } from '../../containers/metamask';
import styles from './Airdrop.module.css';
import { AirdropClam } from './AirdropClaim';
import { getAddChainParameters } from '../../containers/chains';

const AskWalletConnection = ({ onClick, t }: any) => (
  <div className={styles.walletActionContainer}>
    <Typography variant="h6" className={styles.walletActionTitle}>
      {t('airdrop.eligible')}
    </Typography>
    <Typography variant="h6" className={styles.walletActionTitle}>
      {t('airdrop.connectWallet')}
    </Typography>

    <button onClick={onClick} type="button" className={styles.walletActionButton}>
      <img src="/static/metamaskBanner.png" className={styles.logo} alt="Metamask logo" />
      <Typography className={styles.walletActionText}>{t('airdrop.connectBrowserWallet')}</Typography>
    </button>
  </div>
);

const AskWalletSignTC = ({ onClickTAndC, onClick, t }: any) => (
  <div className={styles.walletActionContainer}>
    <div>
      <Typography className={styles.walletActionTitle}>{`${t('airdrop.agreeWith')} `}</Typography>
      <Button type="link" className={styles.linkText} label={` Terms and Conditions `} onClick={onClickTAndC} />

      <Typography className={styles.walletActionTitle}>{` ${t('airdrop.signature')}`}</Typography>
      <Typography className={styles.walletActionTitle}>{t('airdrop.doOnce')}</Typography>
    </div>

    <Button className={styles.walletSignButton} label={t('airdrop.signOnMetamask')} onClick={onClick} />
  </div>
);

export const Airdrop: VFC = () => {
  const [TCSigned, setTCsigned] = useState<boolean>(false);
  const [walletError, setWalletError] = useState<boolean>(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { useChainId, useIsActive, useProvider, useError } = hooks;

  const chainId = useChainId();
  const isActive = useIsActive();
  const provider = useProvider();
  const error = useError();

  useEffect(() => {
    setTCsigned(false);
    setWalletError(false);
  }, []);

  useEffect(() => {
    if (!isActive) {
      setTCsigned(false);
    }
    setWalletError(false);
  }, [isActive]);

  useEffect(() => {
    if (error?.message) {
      setWalletError(true);
    }
  }, [error]);

  const handleConnectWallet = async () => {
    try {
      setWalletError(false);
      if (!isActive) {
        const result = getAddChainParameters(chainId || 1);

        await metaMask.activate(result);
      }
    } catch (e: any) {
      console.log('error', e.message);
      setWalletError(true);
    }
  };

  const handleSignWallet = async () => {
    try {
      setWalletError(false);
      const signResult = await provider
        ?.getSigner()
        .signMessage('Sign this message to agree with the Terms & Conditions.');

      console.log('signResult', signResult);
      setTCsigned(true);
    } catch (e: any) {
      console.log('Failed to sign the wallet', e?.message);
      setWalletError(true);
    }
  };

  const onClickTAndC = () => navigate('/terms-and-conditions');

  const toConnectWallet = !isActive;
  const toSignWallet = isActive && !TCSigned;
  const signedWallet = isActive && TCSigned;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {walletError && <Toast text={t('wallet.connectionErr')} state="error" />}

        {!signedWallet && (
          <div className={styles.titleContainer}>
            <Typography variant="h3" className={styles.title}>
              {t('airdrop.check')}
            </Typography>
          </div>
        )}

        {!signedWallet && <img src="static/airdropImg.svg" alt="airdrop page img" />}

        <div className={styles.airdropDetails}>
          {toConnectWallet && <AskWalletConnection onClick={handleConnectWallet} t={t} />}
          {toSignWallet && <AskWalletSignTC onClick={handleSignWallet} t={t} onClickTAndC={onClickTAndC} />}
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
