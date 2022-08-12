// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import assert from 'assert';
import clsx from 'clsx';
import useSWR from 'swr';

import { TERMS_SIGNATURE_URL } from 'appConstants';
import { NotificationType, openNotificationWithIcon } from 'components/Notification';
import { useWeb3 } from 'containers';
import { AppContext } from 'contextProvider';
import { useContracts, useSignTCHistory } from 'hooks';
import { convertStrToNumber, fetcherPost } from 'utils';

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
  const [hasClaimedIds, setHasClaimedIds] = React.useState<Array<string>>([]);
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

  const isClaiming = !!hasClaimedIds.find(
    (claimedId) => !!unlockedAirdropIds.find((unlockedAirdropId) => unlockedAirdropId === claimedId)
  );
  const canClaim = unlockedAirdropIds.length > 0 && contracts;
  const buttonText = !contracts
    ? t('airdrop.initContract')
    : canClaim
    ? hasSignedTC
      ? t('airdrop.claim')
      : t('termsAndConditions.sign')
    : t('airdrop.nonToClaim');

  const onSignTC = async () => {
    try {
      if (!termsAndConditions || !library)
        throw Error(`Failed to load ${!termsAndConditions ? 'Terms and Conditions' : 'metamask lib'}`);
      const signTermsHash = await library.getSigner().signMessage(termsAndConditions);
      setTCSignHash(signTermsHash);
      console.log('signTermsHash', signTermsHash);
    } catch (error: any) {
      const err = error?.message ?? 'Opps, we hint an issue.';
      console.error('onSignTC Error', err);
      openNotificationWithIcon({
        type: NotificationType.ERROR,
        title: 'Agree Terms And Condition',
        description: err
      });
    }
  };

  // TODO: fix takeContractTx
  const onClaimAirdrop = async () => {
    try {
      assert(contracts, 'Contracts should be available.');
      setIsLoading(true);
      const sortedUnlockedAirdropIds = unlockedAirdropIds.map((airdropId) => convertStrToNumber(airdropId));
      const approvalTx = await contracts.airdropper.batchClaimAirdrop(sortedUnlockedAirdropIds);
      openNotificationWithIcon({ title: t('notification.txSubmittedTitle') });

      const approvalTxResult = await approvalTx.wait();
      if (approvalTxResult.status) {
        setHasClaimedIds(unlockedAirdropIds);

        openNotificationWithIcon({
          type: NotificationType.SUCCESS,
          title: t('airdrop.successClaim'),
          description: t('notification.changeValidIn15s')
        });
      } else {
        throw new Error();
      }
    } catch (error: any) {
      console.error(`Tx Error: ${error}`);
      openNotificationWithIcon({
        type: NotificationType.ERROR,
        title: 'Transaction failure.',
        description: error?.message ?? t('notification.error')
      });
    } finally {
      setIsLoading(false);
    }
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
      loading={isLoading || isClaiming}
    >
      {buttonText}
    </Button>
  );
};
