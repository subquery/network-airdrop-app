// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import assert from 'assert';
import clsx from 'clsx';
import useSWR from 'swr';

import { TERMS_SIGNATURE_URL } from 'appConstants';
import { useWeb3 } from 'containers';
import { AppContext } from 'contextProvider';
import { useContracts, useSignTCHistory } from 'hooks';
import { convertStrToNumber, fetcherPost } from 'utils';
import { takeContractTx } from 'utils/takeContractTx';

import styles from './Airdrop.module.css';

export const AirdropClaimButton: React.FC<{
  unlockedAirdropIds: Array<string>;
}> = ({ unlockedAirdropIds }) => {
  const { termsAndConditions, termsAndConditionsVersion } = React.useContext(AppContext);
  const { t } = useTranslation();
  const { library, account } = useWeb3();
  const contracts = useContracts();
  const signTCHistoryExist = useSignTCHistory(termsAndConditionsVersion);
  const [TCSignHash, setTCSignHash] = React.useState<string>();
  const [hasSignedTC, setHasSignedTC] = React.useState<boolean>(signTCHistoryExist);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const signaturePostBody = {
    account: account ?? '',
    termsVersion: termsAndConditionsVersion,
    termsAndConditions,
    signTermsHash: TCSignHash
  };

  const { data: signHistorySaveResult } = useSWR(
    account && TCSignHash ? TERMS_SIGNATURE_URL : null,
    fetcherPost(signaturePostBody)
  );

  React.useEffect(() => {
    setHasSignedTC(signTCHistoryExist || signHistorySaveResult);
  }, [signHistorySaveResult, signTCHistoryExist]);

  const canClaim = unlockedAirdropIds.length > 0 && contracts;
  const buttonText = !contracts
    ? 'Loading contracts...'
    : canClaim
    ? hasSignedTC
      ? t('airdrop.claim')
      : t('termsAndConditions.sign')
    : t('airdrop.nonToClaim');

  const onSignTC = async () => {
    if (!termsAndConditions || !library) return null;
    try {
      const signTermsHash = await library.getSigner().signMessage(termsAndConditions);
      setTCSignHash(signTermsHash);
      console.log('signTermsHash', signTermsHash);
    } catch (error) {
      // TODO: add error alert or notification
      console.error(error);
    }
  };

  const onClaimAirdrop = async () => {
    assert(contracts, 'Contracts should be available.');
    setIsLoading(true);
    const sortedUnlockedAirdropIds = unlockedAirdropIds.map((airdropId) => convertStrToNumber(airdropId));
    await takeContractTx({ contractTx: contracts.airdropper.batchClaimAirdrop(sortedUnlockedAirdropIds) });
    setIsLoading(false);
  };

  return (
    <Button
      type="primary"
      shape="round"
      block
      disabled={!canClaim}
      size="large"
      onClick={hasSignedTC ? onClaimAirdrop : onSignTC}
      className={clsx(styles.button, canClaim && styles.claimButton)}
      loading={isLoading}
    >
      {buttonText}
    </Button>
  );
};
