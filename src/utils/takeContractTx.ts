// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ContractTransaction } from 'ethers';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Spinner as DefaultSpinner } from '../components';
import { NotificationType, openNotificationWithIcon } from '../components/Notification';

interface ITakeContractTx {
  contractTx: Promise<ContractTransaction>;
  successTitle?: string;
  successText?: string;
  errorTitle?: string;
  errorText?: string;
}

export async function takeContractTx({
  contractTx,
  successText,
  successTitle,
  errorTitle,
  errorText
}: ITakeContractTx) {
  const { t } = useTranslation();
  try {
    const approvalTx = await contractTx;
    openNotificationWithIcon({ title: t('notification.txSubmittedTitle') });

    const approvalTxResult = await approvalTx.wait();
    if (approvalTxResult.status) {
      openNotificationWithIcon({
        type: NotificationType.SUCCESS,
        title: successTitle ?? 'Success',
        description: successText ?? t('notification.changeValidIn15s')
      });
    } else {
      throw new Error(errorText);
    }
  } catch (error) {
    console.error(`Tx Error: ${error}`);
    openNotificationWithIcon({
      type: NotificationType.ERROR,
      title: errorTitle ?? 'Transaction failure.',
      description: errorText ?? t('notification.error')
    });
  }
}
