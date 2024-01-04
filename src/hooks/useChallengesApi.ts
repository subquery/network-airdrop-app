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

export interface Challenge {
  id: number;
  name: string;
  success: boolean;
  reward: number;
  reward_type: "FIXED" | "MULTIPLE";
  description: string;
  cta: string;
  cta_label: string;
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


export const useChallengesApi = (props: { alert?: boolean} = {}) => {
  const { alert = true } = props
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const alertResDecorator = <T extends (...args: any) => any>(
    func: T,
  ): ((...args: Parameters<T>) => Promise<ReturnType<T>>) => async (...args: Parameters<T>): Promise<ReturnType<T>> => {
      const res = await func(...args);

      if (alert && res.status >= 300) {
        openNotification({
          type: 'error',
          description: res.data.error,
          duration: 3,
        });
      }

      return res;
    };

      
  const signup = useCallback(async (params:UserSignupRequest) => {
    const res = await instance.post('/signup', params)
    return res
  }, [])

  const getUserInfo = useCallback(async (account: string) => {
    const res = await instance.get<IUserInfo>(`/user/${account}`)
    return res
  }, [])

  const getUserChallenges = useCallback(async (account: string) => {
    const res = await instance.get<Challenge[]>(`/user/${account}/challenges`)

    return res
  }, [])

  const getUserLeaderboard = useCallback(async (account: string) => {
    const res = await instance.get<LeaderboardSummary>(`/user/${account}/leaderboard`)

    return res
  }, [])

  return {
    signup: alertResDecorator(signup),
    getUserInfo: alertResDecorator(getUserInfo),
    getUserChallenges: alertResDecorator(getUserChallenges),
    getUserLeaderboard: alertResDecorator(getUserLeaderboard)
  }
}