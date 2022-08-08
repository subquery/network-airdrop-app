// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

export const QueryApolloProvider: React.FC = ({ children }) => {
  const client = new ApolloClient({
    uri: process.env.REACT_APP_AIRDROP_SUBQL,
    cache: new InMemoryCache()
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
