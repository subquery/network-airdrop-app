import { useCallback } from 'react';
import axios from 'axios';

import { IUserInfo, useAlertResDecorator } from './useChallengesApi';

const instance = axios.create({
  baseURL: process.env.REACT_APP_DELEGATION_FRENZY_URL
});

export interface IBaseResponse {
  code: number;
  message: string;
}

export interface IDelegationUserInfo extends IBaseResponse {
  data?: {
    id: number;
    created_at: Date;
    updated_at: Date;
    email: string;
    email_verified: true;
    referral_code: string;
    referral_count: string;
    kyc_referral_count: string;
    kyc_verified: false;
    apy: string;
    total_score: string;
    total_reward: string;
    rank: string;
  };
}

export interface ISignup extends IBaseResponse {}

export interface IOneoffChallenge {
  data?: {
    created_at: Date;
    updated_at: Date;
    id: number;
    user_id: string;
    challenge_id: string;
    type: string;
    era: string;
    num: string;
    point: string;
    completed: boolean;
    completed_at: Date;
  }[];
}

interface IRankInfo {
  id: number;
  wallet: string;
  apy: string;
  total_score: string;
  total_reward: string;
  rank: string;
}

export interface ILeaderboardRecord {
  data?: {
    count: number;
    top7: IRankInfo[];
    me: IRankInfo[];
  };
}

export const useDelegationCampaignApi = (props: { alert?: boolean }) => {
  const { alert = true } = props;
  const alertResDecorator = useAlertResDecorator({ alert });

  const getUserInfo = useCallback(async (params: { wallet: string }) => {
    const res = await instance.post<IDelegationUserInfo>('/user/info', params);

    return res;
  }, []);

  const signup = useCallback(async (params: { email: string; wallet: string; referralCode?: string }) => {
    const res = await instance.post<ISignup>('/user/signup', params);

    return res;
  }, []);

  const verify = useCallback(async (params: { verifyEmailCode: string }) => {
    const res = await instance.post<ISignup>('/user/verify', params);

    return res;
  }, []);

  const getOneoffChallenges = useCallback(async (params: { wallet: string }) => {
    const res = await instance.post<IOneoffChallenge>('/challenge/my-oneoff', params);

    return res;
  }, []);

  const getUserLeaderboard = useCallback(async (params: { wallet: string }) => {
    const res = await instance.post<ILeaderboardRecord>(`/challenge/leaderboard`, params);

    return res;
  }, []);

  return {
    getUserInfo,
    verify: alertResDecorator(verify),
    signup: alertResDecorator(signup),
    getOneoffChallenges,
    getUserLeaderboard
  };
};
