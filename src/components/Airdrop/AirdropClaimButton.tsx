/* eslint-disable no-await-in-loop */
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { openNotification } from '@subql/components';
import { Button } from 'antd';
import assert from 'assert';
import clsx from 'clsx';
import { base, baseSepolia } from 'viem/chains';
import { mainnet, sepolia, useAccount, useNetwork, useSwitchNetwork } from 'wagmi';

import { NotificationType, openNotificationWithIcon } from 'components/Notification';
import { useContracts, useRootContracts } from 'hooks';
import { useSign } from 'hooks/useSign';
import { convertStrToNumber, mapContractError } from 'utils';

import styles from './Airdrop.module.less';

export const l1Chain = process.env.REACT_APP_NETWORK === 'testnet' ? sepolia.id : mainnet.id;
export const l1ChainName = process.env.REACT_APP_NETWORK === 'testnet' ? sepolia.name : mainnet.name;

export const l2Chain = process.env.REACT_APP_NETWORK === 'testnet' ? baseSepolia.id : base.id;
export const l2ChainName = process.env.REACT_APP_NETWORK === 'testnet' ? baseSepolia.name : base.name;

export const AirdropClaimButton: React.FC<{
  unlockSeriesIds: string[];
  unlockedAirdropIds: string[];
  l1AirdropIds: number[];
  onSuccessL1: () => void;
}> = ({ unlockSeriesIds, unlockedAirdropIds, l1AirdropIds, onSuccessL1 }) => {
  const { t } = useTranslation();
  const contracts = useContracts();
  const rootContracts = useRootContracts();
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { switchNetwork } = useSwitchNetwork();

  const [hasClaimedIds, setHasClaimedIds] = React.useState<Array<string>>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isLoadingL1, setIsLoadingL1] = React.useState<boolean>(false);

  const { hasSignedTC, onSignTC } = useSign();

  const canClaim = React.useMemo(() => {
    if (!contracts) return false;

    return unlockSeriesIds.length > 0 || unlockedAirdropIds.length > 0;
  }, [unlockSeriesIds, unlockedAirdropIds, contracts]);

  const canClaimL1 = React.useMemo(() => {
    if (!rootContracts) return false;

    return l1AirdropIds.length > 0;
  }, [unlockSeriesIds, unlockedAirdropIds, rootContracts]);

  const shouldChangeToL1 = React.useMemo(() => {
    if (l1AirdropIds.length !== 0) {
      if (chain?.id !== l1Chain) {
        return true;
      }
    }

    return false;
  }, [chain, address, l1AirdropIds]);

  const shouldChangeToL2 = React.useMemo(() => {
    if (unlockSeriesIds.length !== 0 || unlockedAirdropIds.length !== 0) {
      if (chain?.id !== l2Chain) {
        return true;
      }
    }

    return false;
  }, [chain, address, unlockSeriesIds, unlockedAirdropIds]);

  const switchToL1 = async () => {
    switchNetwork?.(l1Chain);
  };

  const switchToL2 = async () => {
    switchNetwork?.(l2Chain);
  };

  const buttonText = !contracts
    ? t('airdrop.initContract')
    : canClaim
    ? hasSignedTC
      ? 'Claim On Base'
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

  const onClaimAirdropL1 = async () => {
    try {
      assert(rootContracts, 'Contracts should be available.');
      setIsLoadingL1(true);
      if (l1AirdropIds.length) {
        const approvalTx = await rootContracts?.airdropperLite.batchClaimAirdrop(l1AirdropIds);
        openNotificationWithIcon({ title: t('notification.txSubmittedTitle') });
        await approvalTx.wait();
        openNotificationWithIcon({
          type: NotificationType.SUCCESS,
          title: `${t('airdrop.successClaim')}`,
          description: 'Please check in your wallet'
        });

        onSuccessL1();
      }
    } catch (error: any) {
      console.error(`Tx Error: ${error}`);
      openNotificationWithIcon({
        type: NotificationType.ERROR,
        title: 'Transaction failure.',
        description: mapContractError(error) ?? t('notification.error')
      });
    } finally {
      setIsLoadingL1(false);
    }
  };

  return (
    <>
      {l1AirdropIds.length && (
        <Button
          type="primary"
          ghost
          shape="round"
          disabled={!canClaimL1}
          size="large"
          onClick={shouldChangeToL1 ? switchToL1 : hasSignedTC ? onClaimAirdropL1 : onSignTC}
          className={clsx(styles.button, canClaimL1 && styles.claimButton)}
          loading={isLoadingL1}
          style={{ flex: 1 }}
        >
          {shouldChangeToL1
            ? `Switch to ${l1ChainName} to continue Claim`
            : hasSignedTC
            ? 'Claim On Ethereum'
            : t('termsAndConditions.sign')}
        </Button>
      )}

      <Button
        type="primary"
        ghost
        shape="round"
        disabled={!canClaim}
        size="large"
        onClick={shouldChangeToL2 ? switchToL2 : hasSignedTC ? onClaimAirdrop : onSignTC}
        className={clsx(styles.button, canClaim && styles.claimButton)}
        loading={isLoading}
        style={{ flex: 1 }}
      >
        {shouldChangeToL2 ? `Switch to ${l2ChainName} to continue Claim` : buttonText}
      </Button>
    </>
  );
};
