import React, { useMemo } from 'react';
import useSWR from 'swr';
import { useAccount, useSignMessage } from 'wagmi';

import { TERMS_SIGNATURE_URL } from 'appConstants';
import { NotificationType, openNotificationWithIcon } from 'components/Notification';
import { AppContext } from 'contextProvider';
import { fetcherPost } from 'utils';

import { useSignTCHistory } from './useSignTCHistory';

export const useSign = () => {
  const { address: account } = useAccount();

  const { termsAndConditions, termsAndConditionsVersion } = React.useContext(AppContext);
  const signTCHistoryExist = useSignTCHistory(termsAndConditionsVersion);
  const [TCSignHash, setTCSignHash] = React.useState<string>();
  const { signMessageAsync } = useSignMessage();
  const signaturePostBody = useMemo(
    () => ({
      account: account ?? '',
      termsVersion: termsAndConditionsVersion,
      termsAndConditions,
      signTermsHash: TCSignHash
    }),
    [account, termsAndConditionsVersion, TCSignHash]
  );

  const { data: signHistorySaveResult } = useSWR(
    account && TCSignHash ? TERMS_SIGNATURE_URL : null,
    fetcherPost(signaturePostBody)
  );

  const hasSignedTC = useMemo(
    () => signTCHistoryExist || signHistorySaveResult,
    [signTCHistoryExist, signHistorySaveResult]
  );

  const onSignTC = async () => {
    try {
      if (!termsAndConditions)
        throw Error(`Failed to load ${!termsAndConditions ? 'Terms and Conditions' : 'metamask lib'}`);

      const signTermsHash = await signMessageAsync({
        message: termsAndConditions
      });
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
      throw Error(error);
    }
  };

  return {
    hasSignedTC,
    onSignTC
  };
};
