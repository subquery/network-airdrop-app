// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Header as SubqlHeader } from '@subql/components';
import { Address, Button, Dropdown } from '@subql/react-ui';

import { injectedConntector, useWeb3 } from 'containers';

// import styles from './Header.module.css';

const FOUNDATION_URL = 'https://subquery.foundation/';
const SUBQUERY_URL = 'https://www.subquery.network/';
const CLAIM_ENABLE = process.env.REACT_APP_CLAIM_ENABLED === 'true';


  const headerEntryLinks =[
    {
      label:'Home',
      link: FOUNDATION_URL,

    },
    {
      label:'Claim',
      link: '/',

    },
    {
      label: 'SubQuery Network',
      link: SUBQUERY_URL,

    }];

const dropdownLinks={
  label: 'Products',
      links: [
    {
      description: 'Explore SubQuery projects built by other teams in the community and hosted on SubQuery’s Managed Service. Get inspired and see what others are building!',
      label: 'SubQuery Explorer',
      link: `https://explorer.subquery.network/`
    },
    {
      description: 'Use SubQuery’s Managed Service to host your SubQuery project, upgrade existing projects, and view detailed analytics on how your SubQuery Project is operating.',
      label: 'SubQuery Managed Service',
      link: `https://managedservice.subquery.network/`,
    },
    {
      description: 'Decentralise your project with SubQuery Kepler Network, which provides indexed data to the global community in an incentivised and verifiable way. You can join and participate as a Consumer, Delegator, or even as an Indexer.',
      label: 'SubQuery Kepler',
      link: "https://kepler.subquery.network",
    }
  ]
}


const WalletButton = () => {
  const { account, activate, deactivate, error } = useWeb3();
  const { t } = useTranslation();

  const handleSelected = (key: string) => {
    if (key === 'disconnect') {
      deactivate();
    }
  };

  const handleConnectWallet = React.useCallback(async () => {
    if (account || !CLAIM_ENABLE) {
      return;
    }

    try {
      await activate(injectedConntector);
    } catch (e) {
      console.log('Failed to activate wallet', e);
    }
  }, [activate, account, deactivate]);

  return account ? (
    <Dropdown items={[{ key: 'disconnect', label: 'Disconnect' }]} onSelected={handleSelected} colorScheme="gradient">
      <Address address={account} size="large" />
    </Dropdown>
  ) : (
    <Button
      type="secondary"
      label={t('header.connectWallet')}
      onClick={handleConnectWallet}
      leftItem={<i className="bi-link-45deg" role="img" aria-label="link" />}
    />
  );
};

export const Header: React.VFC = () => (<>{CLAIM_ENABLE ?<SubqlHeader appNavigation={headerEntryLinks} dropdownLinks={dropdownLinks} rightElement={ <WalletButton />} />:<SubqlHeader appNavigation={headerEntryLinks} dropdownLinks={dropdownLinks} />}</>) ;
