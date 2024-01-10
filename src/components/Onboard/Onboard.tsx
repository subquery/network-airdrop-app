import React, { FC } from 'react';
import { useNavigate, useParams } from 'react-router';
import { openNotification, Spinner } from '@subql/components';
import { useMount } from 'ahooks';

import { useChallengesApi } from 'hooks/useChallengesApi';

interface IProps {}

const Onboard: FC<IProps> = (props) => {
  const { verifyEmail } = useChallengesApi();
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  useMount(async () => {
    try {
      await verifyEmail(params.id);
      openNotification({
        type: 'success',
        description: 'Your email has been verified',
        duration: 10
      });
    } finally {
      navigate('/');
    }
  });

  return (
    <div>
      <Spinner />
    </div>
  );
};
export default Onboard;
