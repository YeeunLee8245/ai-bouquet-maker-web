import { createClient } from '@/shared/supabase/server';
import type { User } from '@supabase/supabase-js';

export type TGetSupabaseUserResult = {
  user: User | null;
  /**
   * @description 로그인 여부
   * TODO: yeeun 익명사용자 처리(정의 필요)
   * @note 존재하지 않는 사용자(익명 사용자)도 로그인 여부에 포함됩니다.
   */
  isLogin: boolean;
};

export async function getSupabaseUser(): Promise<TGetSupabaseUserResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // console.log('user', user);

  return {
    user,
    isLogin: Boolean(user),
  };
}
