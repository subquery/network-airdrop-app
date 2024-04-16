// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { connectorsForWallets, darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import {
  coinbaseWallet,
  metaMaskWallet,
  rainbowWallet,
  safeWallet,
  talismanWallet,
  walletConnectWallet
} from '@rainbow-me/rainbowkit/wallets';
import { configureChains, createConfig, mainnet, sepolia, WagmiConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

import '@rainbow-me/rainbowkit/styles.css';

// goerli and mainnet just for get data actually not supported
const supportedChains =
  process.env.REACT_APP_NETWORK === 'testnet'
    ? [baseSepolia, sepolia]
    : [
        {
          ...base,
          rpcUrls: {
            default: {
              http: [base.rpcUrls.default.http]
            },
            public: {
              http: [base.rpcUrls.default.http]
            },
            fallback: {
              http: base.rpcUrls.default.http
            }
          }
        },
        {
          ...mainnet,
          rpcUrls: {
            default: {
              http: [mainnet.rpcUrls.default.http]
            },
            public: {
              http: [mainnet.rpcUrls.default.http]
            },
            fallback: {
              http: mainnet.rpcUrls.default.http
            }
          }
        }
      ];

// This should ok. It seems is a bug of Ts.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const { chains, publicClient } = configureChains(supportedChains, [publicProvider()]);

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      safeWallet({ chains }),
      metaMaskWallet({ projectId: 'c7ea561f79adc119587d163a68860570', chains }),
      coinbaseWallet({ appName: 'Subquery Network', chains }),
      walletConnectWallet({ projectId: 'c7ea561f79adc119587d163a68860570', chains }),
      talismanWallet({ chains }),
      rainbowWallet({ projectId: 'c7ea561f79adc119587d163a68860570', chains })
    ]
  }
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [...connectors()],
  publicClient
});

export const RainbowProvider = ({ children }: { children: React.ReactNode }) => (
  <WagmiConfig config={wagmiConfig}>
    <RainbowKitProvider
      chains={chains}
      locale="en"
      coolMode
      theme={{
        ...darkTheme(),
        colors: {
          ...darkTheme().colors,
          modalBackground: 'var(--dark-mode-card)'
        }
      }}
    >
      {children}
    </RainbowKitProvider>
  </WagmiConfig>
);
