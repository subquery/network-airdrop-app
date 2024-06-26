import contractErrorCodes from '@subql/contract-sdk/publish/revertcode.json';
import BigNumberJs from 'bignumber.js';
import { BigNumberish } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import moment from 'moment';

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

export function convertSecondsToTimeString(seconds: number): string {
  const days = moment.duration(seconds * 1000).asDays();

  return `${days.toFixed(0)} days`;
}

export const roundToSix = (amount: string | BigNumberish): string => {
  const str = amount.toString();

  if (!str.includes('.')) return str;

  const [left, right] = str.split('.');

  return `${left}.${right.slice(0, 6)}`;
};

export const mapContractError = (error: any) => {
  const rawErrorMsg = error?.data?.message ?? error?.message ?? error?.error ?? error ?? '';

  const revertCode = Object.keys(contractErrorCodes).find((key) =>
    rawErrorMsg.toString().match(`reverted: ${key}`)
  ) as keyof typeof contractErrorCodes;
  return revertCode ? contractErrorCodes[revertCode] : undefined;
};

export const filterSuccessPromoiseSettledResult = <T>(
  result: PromiseSettledResult<T>
): result is PromiseFulfilledResult<T> => result.status === 'fulfilled';

export function formatNumber(num: number | string, precision = 2) {
  const map = [
    { suffix: 'T', threshold: 1e12 },
    { suffix: 'B', threshold: 1e9 },
    { suffix: 'M', threshold: 1e6 },
    { suffix: 'K', threshold: 1e3 },
    { suffix: '', threshold: 1 }
  ];

  const found = map.find((x) => Math.abs(+num) >= x.threshold);
  if (found) {
    const formatted = (+num / found.threshold).toFixed(precision) + found.suffix;
    return formatted;
  }

  if (+num < 1) {
    return (+num).toFixed(precision);
  }

  return num;
}

export function formatNumberWithLocale(num: number | string | BigNumberJs | BigNumberJs, digits = 4) {
  const transform = BigNumberJs(num.toString()).toNumber();

  if (Number.isNaN(transform)) {
    return '0';
  }

  return transform.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
}

export const formatWithBlank = (value: string | number, unit: string, position?: 'left' | 'right') => {
  const transform = BigNumberJs(value.toString());
  if (Number.isNaN(transform)) {
    return '-';
  }

  if (transform.isZero()) return '-';

  return [unit, value, unit]
    .filter((_, index) => {
      if (position === 'left' && index === 2) return false;
      if ((position === 'right' || !position) && index === 0) return false;
      return true;
    })
    .join(' ');
};
