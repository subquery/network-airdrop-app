// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import assert from 'assert';
import clsx from 'clsx';

import { NotificationType, openNotificationWithIcon } from 'components/Notification';
import { useContracts } from 'hooks';
import { useSign } from 'hooks/useSign';
import { convertStrToNumber } from 'utils';

import styles from './Airdrop.module.less';

const SETTLED_AIRDROPS = [0];

export const AirdropClaimButton: React.FC<{
  unlockedAirdropIds: Array<string>;
}> = ({ unlockedAirdropIds }) => {
  const { t } = useTranslation();
  const contracts = useContracts();
  const [hasClaimedIds, setHasClaimedIds] = React.useState<Array<string>>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const { hasSignedTC, onSignTC } = useSign();

  const isClaiming = !!hasClaimedIds.find(
    (claimedId) => !!unlockedAirdropIds.find((unlockedAirdropId) => unlockedAirdropId === claimedId)
  );
  const canClaim = unlockedAirdropIds.length > 0 && contracts;
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
      const sortedUnlockedAirdropIds = unlockedAirdropIds
        .map((id) => convertStrToNumber(id))
        .filter((id) => !SETTLED_AIRDROPS.includes(id));
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
      loading={isLoading || isClaiming}
    >
      {buttonText}
    </Button>
  );
};
