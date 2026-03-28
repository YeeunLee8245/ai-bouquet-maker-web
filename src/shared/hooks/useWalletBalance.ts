import { useQuery } from '@tanstack/react-query';
import { fetchWalletBalance } from '@api/wallet.api';

export function useWalletBalance() {
  const { data: balance } = useQuery({
    queryKey: ['wallet-balance'],
    queryFn: fetchWalletBalance,
  });

  return {
    balance,
    isTokenEmpty: balance !== undefined && balance <= 0,
  };
}
