// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { create, IPFSHTTPClient } from 'ipfs-http-client';
import localforage from 'localforage';
import { LRUCache } from 'lru-cache';

export function concatU8A(a: Uint8Array, b: Uint8Array): Uint8Array {
  const res = new Uint8Array(a.length + b.length);
  res.set(a, 0);
  res.set(b, a.length);
  return res;
}

type InitialState = {
  gateway?: string;
};

const cache = new LRUCache({
  max: 150
})

export function useIpfs(
  initialState?: InitialState,
): { ipfs: IPFSHTTPClient; catSingle: (cid: string) => Promise<Uint8Array> } {
  const { gateway = "https://unauthipfs.subquery.network/ipfs/api/v0"} = initialState ?? {};

  if (!gateway) {
    throw new Error('No IPFS gateway provided');
  }
  const ipfs = React.useRef<IPFSHTTPClient>(create({ url: gateway }));

  React.useEffect(() => {
    ipfs.current = create({ url: gateway });
  }, [gateway]);

  const catSingle = async (cid: string): Promise<Uint8Array> => {
    const cacheKey = `${cid}-IPFS`;
    const result = cache.get(cacheKey) as Uint8Array;
    if (result) {
      return result;
    }

    const cachedRes = await localforage.getItem<Uint8Array>(cacheKey);

    if (cachedRes) {
      cache.set(cacheKey, cachedRes);
      return cachedRes;
    }

    const results = ipfs.current.cat(cid);

    let res: Uint8Array | undefined;

    // eslint-disable-next-line no-restricted-syntax
    for await (const respResult of results) {
      if (!res) {
        res = respResult;
      } else {
        res = concatU8A(res, respResult);
      }
    }

    if (res) {
      cache.set(cacheKey, res);
      localforage.setItem(cacheKey, res);
      return res;
    }

    throw new Error(`No content`);
  };

  return {
    ipfs: ipfs.current,
    catSingle,
  };
}