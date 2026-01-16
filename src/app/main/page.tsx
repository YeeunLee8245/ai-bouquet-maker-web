import { getSupabaseUser } from '@/hooks/get-supabase-user';

// 맞춤 추천 -> 따로 페이지 빼는 것이 아닌 컴포넌트 형태로 중첩해서 띄우기
/**
 * 메인 페이지
 */
export default async function MainPage() {
  const { user, isLogin } = await getSupabaseUser();
  const displayName =
    isLogin && user
      ? ((user.user_metadata as { full_name?: string }).full_name ?? user.email)
      : null;

  const heroText = isLogin
    ? `${displayName ?? '회원'}님, 오늘도 꽃다발로 따뜻함을 전해보세요.`
    : '로그인 후 맞춤 추천을 받아보세요.';

  return (
    <div className='flex min-h-screen items-center justify-center bg-white px-4 py-12'>
      <p className='text-center text-lg font-semibold text-zinc-900'>{heroText}</p>
    </div>
  );
}
