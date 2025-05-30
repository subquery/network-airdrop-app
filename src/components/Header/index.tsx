import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Header as HeaderComponent } from '@subql/components';
import { Address, Button, Dropdown } from '@subql/react-ui';
import { useDisconnect, useSwitchNetwork } from 'wagmi';

import { useAccount } from 'hooks/useAccount';

import styles from './style.module.less';

const FOUNDATION_URL = 'https://subquery.foundation/';
const SUBQUERY_URL = 'https://www.subquery.network/';

const WalletButton = () => {
  const { address: account } = useAccount();
  const switchNetwork = useSwitchNetwork();
  const { t } = useTranslation();

  const { disconnect } = useDisconnect();

  return account ? (
    <Dropdown
      items={[{ key: 'disconnect', label: 'Disconnect' }]}
      onSelected={() => disconnect()}
      colorScheme="gradient"
    >
      <Address address={account} size="large" />
    </Dropdown>
  ) : (
    <ConnectButton.Custom>
      {({ openConnectModal }) => (
        <Button
          onClick={() => {
            openConnectModal();
          }}
          type="secondary"
          label={t('header.connectWallet')}
        />
      )}
    </ConnectButton.Custom>
  );
};

export const Header: React.VFC = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.header}>
      <HeaderComponent
        customLogo={<img src="/icons/logo.png" width={162} height={48} alt="icon" />}
        navigate={(link) => {
          navigate(link);
        }}
        active={() => true}
        appNavigation={[
          {
            label: 'Home',
            link: 'https://subquery.foundation/'
          },
          {
            label: 'SQT Claim',
            link: window.location.href.includes('claim.subquery.foundation')
              ? '/'
              : 'https://claim.subquery.foundation/',
            active: () => window.location.href.includes('claim.subquery.foundation')
          },
          {
            label: 'Blog',
            link: 'https://blog.subquery.network'
          }
        ]}
        rightElement={
          <>
            <span style={{ flex: 1 }} />
            <WalletButton />
          </>
        }
      />
    </div>
  );
};
