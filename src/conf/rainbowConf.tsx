// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { connectorsForWallets, darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  rainbowWallet,
  safeWallet,
  talismanWallet,
  walletConnectWallet
} from '@rainbow-me/rainbowkit/wallets';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { base, baseSepolia, polygon } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

import '@rainbow-me/rainbowkit/styles.css';

// goerli and mainnet just for get data actually not supported
const supportedChains = process.env.REACT_APP_NETWORK === 'testnet' ? [polygon, baseSepolia] : [base];

// This should ok. It seems is a bug of Ts.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const { chains, publicClient } = configureChains(supportedChains, [publicProvider()]);

const talismanWalletConnector = talismanWallet({
  chains
});

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      safeWallet({ chains }),
      metaMaskWallet({ projectId: 'c7ea561f79adc119587d163a68860570', chains }),
      walletConnectWallet({ projectId: 'c7ea561f79adc119587d163a68860570', chains }),
      talismanWalletConnector,
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
