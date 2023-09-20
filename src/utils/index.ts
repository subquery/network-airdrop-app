import { BigNumberish } from 'ethers';
import { formatEther } from 'ethers/lib/utils';

import { TOKEN } from 'appConstants';

export * from './renderAsync';
export * from './takeContractTx';

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

export const convertStrToNumber = (str: string): number => Number.parseInt(str, 10);

export function convertCountToTime(count: number): string {
  let countCopy = count
  let result = '';
  const years = Math.floor(count / 365);
  countCopy %= 365;
  const months = Math.floor(count / 30);
  countCopy %= 30;
  const days = count;

  if (years > 0) {
      result += `${years} year${years > 1 ? 's ' : ' '}`;
  }
  if (months > 0) {
      result += `${months} month${months > 1 ? 's ' : ' '}`;
  }
  if (days > 0) {
      result += `${days} day${days > 1 ? 's' : ''}`;
  }

  return result.trim();
}

