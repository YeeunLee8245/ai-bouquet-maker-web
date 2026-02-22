'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/shared/supabase/client';

export function useSupabaseUser() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['supabase-user'],
    queryFn: async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      return { user, isLogin: Boolean(user) };
    },
    staleTime: 1000 * 60 * 5, // 5분
  });

  return {
    user: data?.user ?? null,
    isLogin: data?.isLogin ?? false,
    isLoading,
    error,
  };
}
