// // Copyright 2020-2021 OnFinality Limited authors & contributors
// // SPDX-License-Identifier: Apache-2.0

import { useContext, useEffect, useState, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Typography, Toast, Alert } from '@subql/react-ui';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { FaArrowRight } from 'react-icons/fa';
// import { hooks, metaMask } from '../../containers/metamask';
import styles from './Airdrop.module.css';
import { AirdropClaim } from './AirdropClaim';
import { getAddChainParameters } from '../../containers/chains';
import { AppContext } from '../../contextProvider';
import { TERMS_SIGNATURE_URL } from '../../constants/urls';
import { fetcher } from '../../utils';

export const Airdrop: VFC = () => <div className={styles.container}>test</div>;

// const AskWalletConnection = ({ onClick, t }: any) => (
//   <div className={styles.walletActionContainer}>
//     <Typography variant="h6" className={styles.walletActionTitle}>
//       {t('airdrop.eligible')}
//     </Typography>
//     <Typography variant="h6" className={styles.walletActionTitle}>
//       {t('airdrop.connectWallet')}
//     </Typography>

//     <button onClick={onClick} type="button" className={styles.walletActionButton}>
//       <div>
//         <img src="/static/metamaskBanner.png" className={styles.logo} alt="Metamask logo" />
//         <Typography className={styles.walletActionText}>{t('airdrop.connectBrowserWallet')}</Typography>
//       </div>
//       <FaArrowRight className={styles.rightArrow} />
//     </button>
//     <div className={styles.switchToBrowserAlert}>
//       <Alert className={styles.switchToBrowserText} state="info" text={t('wallet.useBrowserMetamask')} />
//     </div>
//   </div>
// );

// export const Airdrop: VFC = () => {
//   const [walletError, setWalletError] = useState<boolean>(false);
//   const { termsAndConditionsVersion } = useContext(AppContext);
//   const { t } = useTranslation();
//   const navigate = useNavigate();
//   // const { useChainId, useIsActive, useAccounts, useError } = hooks;
//   // const error = useError();

//   // const accounts = useAccounts();
//   // const chainId = useChainId();
//   // const isActive = useIsActive();

//   // const { data: signHistory } = useSWR(
//   //   accounts ? `${TERMS_SIGNATURE_URL}/${termsAndConditionsVersion}-${accounts[0]}` : null,
//   //   fetcher
//   // );

//   // useEffect(() => {
//   //   if (error?.message) {
//   //     setWalletError(true);
//   //   }
//   // }, [error]);

//   // const handleConnectWallet = async () => {
//   //   try {
//   //     setWalletError(false);
//   //     if (!isActive) {
//   //       const result = getAddChainParameters(chainId || 1);

//   //       await metaMask.activate(result);
//   //     }
//   //   } catch (e: any) {
//   //     console.log('error', e.message);
//   //     setWalletError(true);
//   //   }
//   // };

//   // const onClickTAndC = () => navigate('/terms-and-conditions');

//   const toConnectWallet = false; // isActive;
//   const toSignWallet = false; // isActive && !signHistory;

//   return (
//     <div className={styles.container}>
//       <div className={styles.content}>
//         {walletError && <Toast text={t('wallet.connectionErr')} state="error" />}

//         {!toSignWallet && (
//           <div className={styles.titleContainer}>
//             <Typography variant="h3" className={styles.title}>
//               {t('airdrop.check')}
//             </Typography>
//           </div>
//         )}

//         {!toSignWallet && <img src="static/airdropImg.svg" alt="airdrop page img" />}

//         <div className={styles.airdropDetails}>
//           {toConnectWallet && <AskWalletConnection onClick={() => {}} t={t} />}
//           {toSignWallet && <AirdropClaim setWalletError={setWalletError} />}
//         </div>
//         <div>
//           <Typography className={styles.supportText}>
//             {`${t('support.contact')} `}
//             <a href="/" className={styles.linkText} target="_blank">
//               Discord.
//             </a>
//           </Typography>
//         </div>
//       </div>
//     </div>
//   );
// };
