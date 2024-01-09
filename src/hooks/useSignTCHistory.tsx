// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import useSWR from 'swr';
import { useAccount } from 'wagmi';

import { TERMS_SIGNATURE_URL } from 'appConstants';
import { fetcher } from 'utils';

const getSignatureHistoryId = (termsAndConditionsVersion: string, account: string) =>
  `${termsAndConditionsVersion}:${account}`;

export function useSignTCHistory(termsAndConditionsVersion: string): boolean {
  const [hasSignedTC, setHasSignedTC] = React.useState<boolean>(false);
  const { address: account } = useAccount();

  const signatureId = getSignatureHistoryId(termsAndConditionsVersion, account ?? '');
  const { data, error } = useSWR(`${TERMS_SIGNATURE_URL}/${signatureId}`, fetcher);

  React.useEffect(() => {
    if (data !== undefined) {
      setHasSignedTC(data);
    }
  }, [data, error]);

  return hasSignedTC;
}
