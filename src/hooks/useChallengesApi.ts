import { useCallback } from 'react';
import { openNotification } from '@subql/components';
import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.REACT_APP_CHALLENGE_URL,
});

export interface IUserInfo {
  address: string;
  email: string;
  verified_email: boolean;
  raw_score: number;
  total_score: number;
  rank: number;
  referral_code: string;
  referral_count: number 
}

export const useChallengesApi = ({ alert = true }) => {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const alertResDecorator = <T extends (...args: any) => any>(
    func: T,
  ): ((...args: Parameters<T>) => Promise<ReturnType<T>>) => async (...args: Parameters<T>): Promise<ReturnType<T>> => {
      const res = await func(...args);

      if (alert && res.status !== 200) {
        openNotification({
          type: 'error',
          description: res.data.error,
          duration: 5000,
        });
      }

      return res;
    };

      
  const signup = useCallback(async () => {
    const res = await instance.post('/signup')
  }, [])

  const getUserInfo = useCallback(async (account: string) => {
    const res = await instance.get<IUserInfo>(`/${account}`)
    return res

  }, [])

  return {
    signup
  }
}