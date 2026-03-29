import { useQuery } from '@tanstack/react-query';
import { fetchWalletBalance } from '@api/wallet.api';
import { useUserAuth } from '@/hooks/use-supabase-user';

export function useWalletBalance() {
  const { isLogin } = useUserAuth();
  const { data: balance } = useQuery({
    queryKey: ['wallet-balance'],
    queryFn: fetchWalletBalance,
    enabled: isLogin,
  });

  return {
    balance,
    isTokenEmpty: balance !== undefined && balance <= 0,
  };
}
