import { useAccount as useAccountWagmi } from 'wagmi';

export const useAccount = () => {
  const accountFromWagmi = useAccountWagmi();

  const account = new URL(window.location.href).searchParams.get('customAddress') || accountFromWagmi.address;
  return {
    ...accountFromWagmi,
    address: account,
    account
  };
};
