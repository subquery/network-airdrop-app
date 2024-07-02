import React, { FC } from 'react';
import { useNavigate, useParams } from 'react-router';
import { openNotification, Spinner } from '@subql/components';
import { useMount } from 'ahooks';

import { Loading } from 'components/Loading/Loading';
import { useDelegationCampaignApi } from 'hooks/useDelegationCampaignApi';

interface IProps {}

const Onboard: FC<IProps> = (props) => {
  const { verify } = useDelegationCampaignApi({
    alert: true
  });
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  useMount(async () => {
    try {
      const res = await verify({
        verifyEmailCode: params.id || ''
      });
      if (res.data.code === 0) {
        openNotification({
          type: 'success',
          description: 'Your email has been verified',
          duration: 10
        });
      }
    } finally {
      navigate('/');
    }
  });

  return (
    <div>
      <Loading></Loading>
    </div>
  );
};
export default Onboard;
