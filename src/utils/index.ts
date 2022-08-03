import { BigNumberish } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { TOKEN } from '../constants';

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const fetcherWithOps = (options: any) => (url: string) => fetch(url, options).then((res) => res.json());

export const formatAmount = (amount: BigNumberish): string => `${formatEther(amount)} ${TOKEN}`;
