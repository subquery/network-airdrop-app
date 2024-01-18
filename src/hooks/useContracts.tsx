// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
// eslint-disable-next-line camelcase
import { ContractSDK, Vesting, Vesting__factory } from '@subql/contract-sdk';
import mainnetDeployment from '@subql/contract-sdk/publish/mainnet.json';
import testnetDeployment from '@subql/contract-sdk/publish/testnet.json';
import { SQNetworks } from '@subql/network-config';
import { providers } from 'ethers';
import { HttpTransport } from 'viem';
import { PublicClient, usePublicClient, useWalletClient, WalletClient } from 'wagmi';

export function publicClientToProvider(publicClient: PublicClient) {
  const { chain, transport } = publicClient;

  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address
  };
  if (transport.type === 'fallback') {
    return new providers.FallbackProvider(
      (transport.transports as ReturnType<HttpTransport>[]).map(
        ({ value }) => new providers.JsonRpcProvider(value?.url, network)
      )
    );
  }
  return new providers.JsonRpcProvider(transport.url, network);
}

export function useEthersProviderWithPublic({ chainId }: { chainId?: number } = {}) {
  const publicClient = usePublicClient({ chainId });
  return React.useMemo(() => publicClientToProvider(publicClient), [publicClient]);
}

export function walletClientToSignerAndProvider(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);
  return {
    provider,
    signer
  };
}

function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: walletClient } = useWalletClient({ chainId });
  return React.useMemo(
    () => (walletClient ? walletClientToSignerAndProvider(walletClient) : { signer: undefined, provider: undefined }),
    [walletClient]
  );
}

const Network = process.env.REACT_APP_NETWORK;

export function useContracts(): ContractSDK | undefined {
  const [contracts, setContracts] = React.useState<ContractSDK | undefined>();
  const { signer } = useEthersSigner();
  const provider = useEthersProviderWithPublic();

  const signerOrProvider = React.useMemo(() => signer || provider, [signer, provider]);

  const initSdk = React.useCallback(async () => {
    if (!signerOrProvider) {
      setContracts(undefined);
      return;
    }

    const deploymentDetails = Network === 'mainnet' ? mainnetDeployment : testnetDeployment;

    const pendingContracts = ContractSDK.create(signerOrProvider, {
      network: Network as SQNetworks
    });

    setContracts(pendingContracts);
  }, [signerOrProvider]);

  React.useEffect(() => {
    if (!signerOrProvider) return;
    initSdk();
  }, [initSdk, signerOrProvider]);

  return contracts;
}

export function useVestingContracts(): (contract: string) => Promise<Vesting | undefined> {
  const { signer } = useEthersSigner();
  const provider = useEthersProviderWithPublic();

  const signerOrProvider = React.useMemo(() => signer || provider, [signer, provider]);

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
