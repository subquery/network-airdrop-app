// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { gql, OperationVariables, QueryResult, useQuery } from '@apollo/client';
import { GetAirdrops } from '../__generated__/airdropSubql/GetAirdrops';
import {
  GetAirdropsByAccount,
  GetAirdropsByAccountVariables
} from '../__generated__/airdropSubql/GetAirdropsByAccount';

const GET_AIRDROPS = gql`
  query GetAirdrops {
    airdrops {
      totalCount
      nodes {
        id
        tokenAddress
        startTime
        endTime
      }
    }
  }
`;

const GET_AIRDROPS_BY_ACCOUNT = gql`
  query GetAirdropsByAccount($account: String!) {
    airdropUsers(filter: { userId: { equalTo: $account } }) {
      totalCount
      nodes {
        id
        user {
          id
          totalAirdropAmount
          claimedAmount
        }
        airdrop {
          id
          tokenAddress
          startTime
          endTime
        }
        amount
        status
      }
    }
  }
`;

export function useAllAirdrop(): QueryResult<GetAirdrops> {
  return useQuery<GetAirdrops>(GET_AIRDROPS);
}

export function useAirdropsByAccount(params: GetAirdropsByAccountVariables): QueryResult<GetAirdropsByAccount> {
  return useQuery<GetAirdropsByAccount, OperationVariables>(GET_AIRDROPS_BY_ACCOUNT, { variables: params });
}
