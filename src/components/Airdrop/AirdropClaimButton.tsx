/* eslint-disable no-await-in-loop */
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { openNotification } from '@subql/components';
import { Button } from 'antd';
import assert from 'assert';
import clsx from 'clsx';

import { NotificationType, openNotificationWithIcon } from 'components/Notification';
import { useContracts } from 'hooks';
import { useSign } from 'hooks/useSign';

import styles from './Airdrop.module.less';

const SETTLED_AIRDROPS = [0];

export const AirdropClaimButton: React.FC<{
  unlockSeriesIds: string[];
}> = ({ unlockSeriesIds }) => {
  const { t } = useTranslation();
  const contracts = useContracts();
  const [hasClaimedIds, setHasClaimedIds] = React.useState<Array<string>>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const { hasSignedTC, onSignTC } = useSign();

  const canClaim = React.useMemo(() => {
    if (!contracts) return false;

    return unlockSeriesIds.length > 0;
  }, [unlockSeriesIds, contracts]);
  const buttonText = !contracts
    ? t('airdrop.initContract')
    : canClaim
    ? hasSignedTC
      ? t('airdrop.claim')
      : t('termsAndConditions.sign')
    : t('airdrop.nonToClaim');

  // TODO: fix takeContractTx
  const onClaimAirdrop = async () => {
    try {
      assert(contracts, 'Contracts should be available.');
      setIsLoading(true);

      if (unlockSeriesIds.length) {
        // eslint-disable-next-line no-restricted-syntax
        for (const seriesId of unlockSeriesIds) {
          openNotification({
            type: 'info',
            description: `Claiming Nft Series`,
            duration: 3
          });
          const approvalTx = await contracts.sqtGift.batchMint(seriesId);
          await approvalTx.wait();
          openNotification({
            type: 'success',
            description: 'Claim Nft Series success',
            duration: 3
          });
        }
      }
    } catch (error: any) {
      console.error(`Tx Error: ${error}`);
      openNotificationWithIcon({
        type: NotificationType.ERROR,
        title: 'Transaction failure.',
        description: error?.message ?? t('notification.error')
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="primary"
      shape="round"
      block
      disabled={!canClaim}
      size="large"
      onClick={hasSignedTC ? onClaimAirdrop : onSignTC}
      className={clsx(styles.button, canClaim && styles.claimButton)}
      loading={isLoading}
    >
      {buttonText}
    </Button>
  );
};
