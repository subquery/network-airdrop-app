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
    era_config: {
      key: 'start_era' | 'end_era' | 'current_era';
      value: string;
    }[];
  };
}

export interface ISignup extends IBaseResponse {}

export interface IOneoffChallenge {
  data?: {
    challenge_cta: string;
    challenge_cta_link?: string;
    challenge_description: string;
    challenge_id: number;
    challenge_title: string;
    challenge_point: string;
    userChallenge_completed: boolean;
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
    beforeMe: number;
    count: number;
    top7: IRankInfo[];
    me: IRankInfo[];
  };
}

export interface IMyEraInfoItem {
  id: number;
  user_id: string;
  delegation: string;
  reward: string;
  era: string;
  point: string;
  apy: string;
  apyRank: string;
  lootbox: string;
}

export interface IMyEraInfo {
  data?: IMyEraInfoItem[];
}

export interface IMyLootboxItem {
  created_at: string;
  updated_at: string;
  id: number;
  user_id: string;
  challenge_id: string;
  type: string;
  era: string;
  num: string;
  point: string;
  completed: boolean;
  completed_at: string;
}

export interface IMyLootbox {
  data?: IMyLootboxItem[];
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

  const getMyEraInfo = useCallback(async (params: { wallet: string }) => {
    const res = await instance.post<IMyEraInfo>(`/user/my-era`, params);

    return res;
  }, []);

  const getMyLootbox = useCallback(async (params: { wallet: string; era: number | string }) => {
    const res = await instance.post<IMyLootbox>(`/challenge/my-lootbox`, params);

    return res;
  }, []);

  const openLootbox = useCallback(async (params: { wallet: string; era: number | string; num: string }) => {
    const res = await instance.post<IBaseResponse>(`/challenge/mark-lootbox`, params);

    return res;
  }, []);

  const sendVerifyEmail = useCallback(async (params: { wallet: string }) => {
    const res = await instance.post<IBaseResponse>(`/user/send-verify-email`, params);

    return res;
  }, []);

  return {
    getUserInfo: alertResDecorator(getUserInfo),
    verify: alertResDecorator(verify),
    signup: alertResDecorator(signup),
    getOneoffChallenges,
    getUserLeaderboard,
    getMyEraInfo,
    getMyLootbox,
    openLootbox: alertResDecorator(openLootbox),
    sendVerifyEmail: alertResDecorator(sendVerifyEmail)
  };
};
