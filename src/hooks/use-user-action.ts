'use client';

import { useRouter } from 'next/navigation';

import { createClient } from '@shared/supabase/client';

export const useUserAction = () => {
  const router = useRouter();
  const supabase = createClient();

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(`로그아웃 과정에서 오류가 발생했어요: ${error.message}`);
    }

    router.push('/login');
  };

  return {
    signOut,
  };
};
