// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
// eslint-disable-next-line camelcase
import { ContractSDK, Vesting, Vesting__factory } from '@subql/contract-sdk';
import keplerDeployment from '@subql/contract-sdk/publish/kepler.json';
import testnetDeployment from '@subql/contract-sdk/publish/testnet.json';

import { useWeb3 } from '../containers';

const Network = process.env.REACT_APP_NETWORK;

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

    const deploymentDetails = Network === 'kepler' ? keplerDeployment : testnetDeployment;

    // @ts-ignore
    const pendingContracts = await ContractSDK.create(signerOrProvider, { deploymentDetails });

    setContracts(pendingContracts);
  }, [signerOrProvider]);

  React.useEffect(() => {
    initSdk();
  }, [initSdk]);

  return contracts;
}

export function useVestingContracts(): (contract: string) => Promise<Vesting | undefined> {
  const web3 = useWeb3();

  const signerOrProvider = React.useMemo(
    () => (web3.account ? web3.library?.getSigner(web3.account) : web3.library),
    [web3]
  );

  const initContract = async (vestingContractAddress: string) => {
    if (!signerOrProvider) {
      return;
    }

    // eslint-disable-next-line camelcase
    const vestingContract = await Vesting__factory.connect(vestingContractAddress, signerOrProvider);
    return vestingContract;
  };

  return initContract;
}
