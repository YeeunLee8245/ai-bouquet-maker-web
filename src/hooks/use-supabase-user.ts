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
