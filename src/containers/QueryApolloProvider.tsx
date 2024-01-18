// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { ApolloClient, ApolloLink, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client';
import { deploymentHttpLink } from '@subql/apollo-links';

const getAirdroplink = () => {
  const httpOptions = { fetch, fetchOptions: { timeout: 5000 } };

  return deploymentHttpLink({
    deploymentId: process.env.REACT_APP_DEPLOYMENT_ID as string,
    httpOptions,
    authUrl: process.env.REACT_APP_AUTH_URL as string,
    fallbackServiceUrl: process.env.REACT_APP_AIRDROP_SUBQL
  }).link;
};

export const VESTING = 'VESTING';
export const vestingLink = new HttpLink({ uri: process.env.REACT_APP_VESTING_SUBQL });
export const GIFT = 'GIFT';
export const giftLink = new HttpLink({ uri: process.env.REACT_APP_AIRDROP_GIFT_SUBQL });

export const QueryApolloProvider: React.FC = ({ children }) => {
  const client = new ApolloClient({
    link: ApolloLink.split(
      (operation) => operation.getContext().clientName === GIFT,
      giftLink,
      ApolloLink.split((operation) => operation.getContext().clientName === VESTING, vestingLink, getAirdroplink())
    ),
    cache: new InMemoryCache()
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
