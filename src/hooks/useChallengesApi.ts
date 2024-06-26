import { useCallback } from 'react';
import { openNotification } from '@subql/components';
import axios, { AxiosError } from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_CHALLENGE_URL
});

export interface IUserInfo {
  address: string;
  email: string; // This is not the full email address
  verified_email: boolean;
  raw_score: number;
  challenge_score: number;
  total_score: number;
  referral_code: string;
  referral_count: number;
  kyc_referral_count: number;
  rank: number;
  has_kyc: boolean;
}

export interface Challenge {
  id: number;
  name: string;
  success: boolean;
  reward: number;
  reward_type: 'FIXED' | 'MULTIPLE';
  description: string;
  cta: string;
  cta_label: string;
  sort_order: number;
}

export interface LeaderboardRecord {
  rank: number;
  name: string;
  raw_score: number;
  referral_multiplier: number;
  total_score: number;
}

export interface LeaderboardSummary {
  total_participants: number;
  summary: LeaderboardRecord[];
}

export interface UserSignupRequest {
  address: string;
  email: string;
  referral_code?: string;
}

export const useAlertResDecorator = (props: { alert?: boolean }) => {
  const { alert = true } = props;

  return <T extends (...args: any[]) => any>(func: T): ((...args: Parameters<T>) => Promise<ReturnType<T>>) =>
    async (...args: Parameters<T>): Promise<ReturnType<T>> => {
      try {
        const res = await func(...args);
        return res;
      } catch (e: any) {
        if (alert) {
          if (e instanceof AxiosError) {
            const error = e as AxiosError<{ message: string }>;
            if (error.response?.data.message) {
              openNotification({
                type: 'error',
                description: error.response?.data.message,
                duration: 10
              });
            }
          }
        }

        throw new Error(e);
      }
    };
};

export const useChallengesApi = (props: { alert?: boolean } = {}) => {
  const { alert = true } = props;
  const alertResDecorator = useAlertResDecorator({ alert });

  const signup = useCallback(async (params: UserSignupRequest) => {
    const res = await instance.post('/signup', params);
    return res;
  }, []);

  const getUserInfo = useCallback(async (account: string) => {
    const res = await instance.get<IUserInfo>(`/user/${account}`);

    return res;
  }, []);

  const getUserChallenges = useCallback(async (account: string) => {
    const res = await instance.get<Challenge[]>(`/user/${account}/challenges`);

    return res;
  }, []);

  const getUserLeaderboard = useCallback(async (account: string) => {
    const res = await instance.get<LeaderboardSummary>(`/user/${account}/leaderboard`);

    return res;
  }, []);

  const sendEmail = useCallback(async (account) => {
    const res = await instance.get(`/user/${account}/verify`);

    return res;
  }, []);

  const verifyEmail = useCallback(async (account) => {
    const res = await instance.post(`/verify_email/${account}`);

    return res;
  }, []);

  return {
    signup: alertResDecorator(signup),
    // remove alert decorator or not?
    getUserInfo: alertResDecorator(getUserInfo),
    getUserChallenges: alertResDecorator(getUserChallenges),
    getUserLeaderboard: alertResDecorator(getUserLeaderboard),
    sendEmail: alertResDecorator(sendEmail),
    verifyEmail: alertResDecorator(verifyEmail)
  };
};
