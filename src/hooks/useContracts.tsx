// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { ContractSDK } from '@subql/contract-sdk';
import deploymentDetails from '@subql/contract-sdk/publish/testnet.json';

import { useWeb3 } from '../containers';

export function useContracts(): ContractSDK | undefined {
  const [contracts, setContracts] = React.useState<ContractSDK | undefined>();
  const web3 = useWeb3();

  const signerOrProvider = React.useMemo(
    () => (web3.account ? web3.library?.getSigner(web3.account) : web3.library),
    [web3]
  );

  const initSdk = React.useCallback(async () => {
    if (!signerOrProvider) {
      setContracts(undefined);
      return;
    }

    const pendingContracts = await ContractSDK.create(signerOrProvider, { deploymentDetails });

    setContracts(pendingContracts);
  }, [signerOrProvider]);

  React.useEffect(() => {
    initSdk();
  }, [initSdk]);

  return contracts;
}
