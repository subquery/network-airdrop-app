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
import { convertStrToNumber, mapContractError } from 'utils';

import styles from './Airdrop.module.less';

export const AirdropClaimButton: React.FC<{
  unlockSeriesIds: string[];
  unlockedAirdropIds: string[];
}> = ({ unlockSeriesIds, unlockedAirdropIds }) => {
  const { t } = useTranslation();
  const contracts = useContracts();
  const [hasClaimedIds, setHasClaimedIds] = React.useState<Array<string>>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const { hasSignedTC, onSignTC } = useSign();

  const canClaim = React.useMemo(() => {
    if (!contracts) return false;

    return unlockSeriesIds.length > 0 || unlockedAirdropIds.length > 0;
  }, [unlockSeriesIds, unlockedAirdropIds, contracts]);
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
            description: `Claiming Nft Series ${seriesId}`,
            duration: 3
          });
          const approvalTx = await contracts.sqtGift.batchMint(seriesId);
          await approvalTx.wait();
          openNotification({
            type: 'success',
            description: `Claim Nft Series ${seriesId} success`,
            duration: 3
          });
        }
      }

      if (unlockedAirdropIds.length) {
        const sortedUnlockedAirdropIds = unlockedAirdropIds.map((id) => convertStrToNumber(id));

        const approvalTx = await contracts.airdropper.batchClaimAirdrop(sortedUnlockedAirdropIds);
        openNotificationWithIcon({ title: t('notification.txSubmittedTitle') });
        const approvalTxResult = await approvalTx.wait();
        if (approvalTxResult.status) {
          setHasClaimedIds(unlockedAirdropIds);

          openNotificationWithIcon({
            type: NotificationType.SUCCESS,
            title: t('airdrop.successClaim'),
            description: t('notification.changeValidIn15s')
          });
        } else {
          throw new Error();
        }
      }
    } catch (error: any) {
      console.error(`Tx Error: ${error}`);
      openNotificationWithIcon({
        type: NotificationType.ERROR,
        title: 'Transaction failure.',
        description: mapContractError(error) ?? t('notification.error')
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="primary"
      ghost
      shape="round"
      disabled={!canClaim}
      size="large"
      onClick={hasSignedTC ? onClaimAirdrop : onSignTC}
      className={clsx(styles.button, canClaim && styles.claimButton)}
      loading={isLoading}
      style={{ flex: 1 }}
    >
      {buttonText}
    </Button>
  );
};
