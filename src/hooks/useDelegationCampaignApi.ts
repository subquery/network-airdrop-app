import axios from 'axios';

import { useAlertResDecorator } from './useChallengesApi';

const instance = axios.create({
  baseURL: process.env.REACT_APP_CHALLENGE_URL
});

export const useDelegationCampaignApi = (props: { alert?: boolean }) => {
  const { alert = true } = props;
  const alertResDecorator = useAlertResDecorator({ alert });

  return {
    getUserInfo: alertResDecorator(async () => {
      // eslint-disable-next-line no-promise-executor-return
      const res = await new Promise((resolve) => setTimeout(resolve, 1000));
      return true;
    })
  };
};
