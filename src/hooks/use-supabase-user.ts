'use client';

import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/shared/supabase/client';

const USER_AUTH_QUERY_KEY = ['user-auth'];

export function useUserAuth() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      queryClient.invalidateQueries({ queryKey: USER_AUTH_QUERY_KEY });
      // 로그인/로그아웃 시 isLiked가 포함된 꽃 관련 쿼리도 갱신
      queryClient.invalidateQueries({ queryKey: ['flower-directory'] });
      queryClient.invalidateQueries({ queryKey: ['flower'] });
    });

    return () => subscription.unsubscribe();
  }, [queryClient, supabase]);

  const { data, isLoading, error } = useQuery({
    queryKey: USER_AUTH_QUERY_KEY,
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return { user, isLogin: Boolean(user) };
    },
  });

  return {
    user: data?.user ?? null,
    isLogin: data?.isLogin ?? false,
    isLoading,
    error,
  };
}
