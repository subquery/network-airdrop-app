import { BigNumberish } from 'ethers';
import { formatEther } from 'ethers/lib/utils';

import { TOKEN } from 'appConstants';

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const fetcherWithOps = (options: any) => (url: string) => fetch(url, options).then((res) => res.json());

export const fetcherPost = (options: any) => {
  const postOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(options)
  };

  return fetcherWithOps(postOptions);
};

export const formatAmount = (amount: BigNumberish): string => `${formatEther(amount)} ${TOKEN}`;
