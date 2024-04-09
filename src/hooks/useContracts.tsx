// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
// eslint-disable-next-line camelcase
import { ContractSDK, RootContractSDK, Vesting, Vesting__factory } from '@subql/contract-sdk';
import { SQNetworks } from '@subql/network-config';
import { providers } from 'ethers';
import { HttpTransport } from 'viem';
import { base, mainnet } from 'viem/chains';
import { PublicClient, usePublicClient, useWalletClient, WalletClient } from 'wagmi';

export function publicClientToProvider(publicClient: PublicClient) {
  const { chain, transport } = publicClient;

  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address
  };

  const fetchUrl = {
    [base.id]: process.env.REACT_APP_SUBQUERY_OFFICIAL_BASE_RPC,
    [mainnet.id]: process.env.REACT_APP_SUBQUERY_OFFICIAL_ETH_RPC
  }[chain.id];

  if (transport.type === 'fallback') {
    return new providers.FallbackProvider(
      (transport.transports as ReturnType<HttpTransport>[]).map(
        ({ value }) => new providers.JsonRpcProvider(fetchUrl || value?.url, network)
      )
    );
  }
  return new providers.JsonRpcProvider(fetchUrl || transport.url, network);
}

export function useEthersProviderWithPublic({ chainId }: { chainId?: number } = {}) {
  const publicClient = usePublicClient({ chainId });
  return React.useMemo(() => publicClientToProvider(publicClient), [publicClient]);
}

let requestId = 0;

export function walletClientToSignerAndProvider(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address
  };
  const provider = new providers.Web3Provider(
    {
      ...transport,
      async request(request, ...rest) {
        try {
          const fetchUrl = {
            [base.id]: process.env.REACT_APP_SUBQUERY_OFFICIAL_BASE_RPC,
            [mainnet.id]: process.env.REACT_APP_SUBQUERY_OFFICIAL_ETH_RPC
          }[chain.id];

          if (fetchUrl) {
            requestId += 1;
            const res = await fetch(fetchUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                jsonrpc: '2.0',
                // seems the id in JSONRPC is used for sort
                id: requestId,
                ...request
              })
            });
            const { result, error } = await res.json();

            if (!result) {
              throw new Error(error);
            }
            return result;
          }
        } catch (e) {
          return transport.request(request, ...rest);
        }
        return transport.request(request, ...rest);
      }
    },
    network
  );
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

export function useRootContracts(): RootContractSDK | undefined {
  const [contracts, setContracts] = React.useState<RootContractSDK | undefined>();
  const { signer } = useEthersSigner();
  const provider = useEthersProviderWithPublic();

  const signerOrProvider = React.useMemo(() => signer || provider, [signer, provider]);

  const initSdk = React.useCallback(async () => {
    if (!signerOrProvider) {
      setContracts(undefined);
      return;
    }
    const pendingContracts = RootContractSDK.create(signerOrProvider, {
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
