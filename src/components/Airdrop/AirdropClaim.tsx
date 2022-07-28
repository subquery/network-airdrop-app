// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC, useContext, useEffect, useState, VFC } from 'react';
import { Button, Typography } from '@subql/react-ui';
import useSWR from 'swr';
import { t } from 'i18next';
import styles from './AirdropClaim.module.css';
import { EmailSubscription } from '../EmailSubscription';
// import { hooks } from '../../containers/metamask';
import { ACCOUNT_INFO_URL, TERMS_SIGNATURE_URL } from '../../constants/urls';
import { fetcher, fetcherWithOps } from '../../utils';
import { AppContext } from '../../contextProvider';
import { useWeb3 } from '../../containers/Web3';

const tableTitles = [t('airdrop.category'), t('airdrop.amount'), t('airdrop.status')];

export const AirdropClaim: FC<{ setWalletError: any }> = ({ setWalletError }) => (
  // const all = useWeb3();
  // // const accounts = useAccounts();
  // const [TCSigned, setTCsigned] = useState<boolean>(false);
  // const [TCSignHash, setTCSignHash] = useState<string>();
  // const { termsAndConditions, termsAndConditionsVersion } = useContext(AppContext);
  // const provider = {}; // useProvider();

  // const isActive = true; // useIsActive();

  // const postOptions = {
  //   method: 'POST',
  //   headers: {
  //     Accept: 'application/json, text/plain, */*',
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({
  //     account: accounts ? accounts[0] : '',
  //     termsVersion: termsAndConditionsVersion,
  //     signTermsHash: TCSignHash
  //   })
  // };

  // const { data: signHistorySaveResult } = useSWR(
  //   accounts && TCSignHash ? TERMS_SIGNATURE_URL : null,
  //   fetcherWithOps(postOptions)
  // );

  // useEffect(() => {
  //   if (!isActive) {
  //     setTCsigned(false);
  //   }
  //   setWalletError(false);
  // }, [isActive]);

  // useEffect(() => {
  //   if (signHistorySaveResult) {
  //     setTCsigned(true);
  //     setWalletError(false);
  //   }
  // }, [signHistorySaveResult]);

  // const { data: signHistory } = useSWR(
  //   accounts ? `${TERMS_SIGNATURE_URL}/${termsAndConditionsVersion}-${accounts[0]}` : null,
  //   fetcher
  // );

  // const { data: accountInfo, error: fetchError } =
  //   useSWR(accounts ? `${ACCOUNT_INFO_URL}/${accounts[0]}` : null, fetcher) || {};

  // const { acalaTop100UserAirdrop, nftAirdrop, testnetAirdrop } = accountInfo || {};

  // const tableInfo = [
  //   {
  //     category: t('airdrop.testnetParticipant'),
  //     amount: `${testnetAirdrop || 0} SQT`,
  //     status: t('airdrop.locked')
  //   },
  //   {
  //     category: t('airdrop.acalaTop100'),
  //     amount: `${acalaTop100UserAirdrop || 0} SQT`,
  //     status: t('airdrop.locked')
  //   },
  //   {
  //     category: t('airdrop.addition'),
  //     amount: `X ${nftAirdrop || 0} SubQuery NFT`,
  //     status: t('airdrop.locked')
  //   }
  // ];

  // const handleSignWallet = async () => {
  //   try {
  //     setWalletError(false);
  //     const signTermsHash = await provider
  //       ?.getSigner()
  //       .signMessage(termsAndConditions || 'Sign this message to agree with the Terms & Conditions.');

  //     if (signTermsHash) {
  //       setTCSignHash(signTermsHash);
  //       setTCsigned(true);
  //     } else {
  //       throw new Error('SignTermsHash is null or no account detected');
  //     }
  //   } catch (e: any) {
  //     console.log('Failed to sign the wallet', e?.message);
  //     setWalletError(true);
  //   }
  // };

  // // TODO: canClaim is just a placeholder variable (remove later)
  // const canClaim = true;
  // const toSignWallet = isActive && !TCSigned && !signHistory;
  // const signedWallet = (isActive && TCSigned) || signHistory;

  // return (
  //   <div className={styles.container}>
  //     <div className={styles.airdropClaimBoard}>
  //       <div>
  //         <Typography className={styles.title} variant="h6">
  //           {t('airdrop.yourAirDrop')}
  //         </Typography>
  //       </div>
  //       <div className={styles.content}>
  //         <div className={styles.tableTitle}>
  //           {tableTitles.map((title, index) => (
  //             <div className={index === 0 ? styles.category : ''} key={title}>
  //               {title.toUpperCase()}
  //             </div>
  //           ))}
  //         </div>
  //         <div className={styles.divisionLine} />
  //         <div>
  //           {tableInfo.map((info) => (
  //             <div className={styles.tableContent} key={info.category}>
  //               <div className={styles.category}>{info.category}</div>
  //               <div>{info.amount}</div>
  //               <div>{info.status}</div>
  //             </div>
  //           ))}

  //           <div className={styles.airdropClaimImg}>
  //             <img src="static/airdropClaim.png" alt="airdrop page img" />
  //           </div>
  //         </div>
  //       </div>
  //       <div className={styles.airdropClaimAmount}>
  //         <div>{t('airdrop.total')}</div>
  //         <div>{`${testnetAirdrop + acalaTop100UserAirdrop} SQT + ${nftAirdrop} NFT`}</div>
  //       </div>

  //       {!canClaim && (
  //         <Button
  //           type="secondary"
  //           disabled
  //           colorScheme="neutral"
  //           label={t('airdrop.claimDateTBA')}
  //           className={styles.airdropClaim}
  //           onClick={handleSignWallet}
  //         />
  //       )}

  //       {/* TODO: want to combine these into one */}
  //       {canClaim && toSignWallet && (
  //         <Button
  //           type="secondary"
  //           colorScheme="neutral"
  //           label="Agree to Terms & Conditions"
  //           className={styles.airdropClaim}
  //           onClick={handleSignWallet}
  //         />
  //       )}
  //       {canClaim && signedWallet && (
  //         <Button
  //           type="secondary"
  //           colorScheme="neutral"
  //           label="Claim Tokens"
  //           className={styles.airdropClaim}
  //           onClick={() => alert('replace with metamask prompt')}
  //         />
  //       )}
  //     </div>
  //     <EmailSubscription />
  //   </div>
  // );
  <div />
);
