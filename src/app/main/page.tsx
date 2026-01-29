import { getSupabaseUser } from '@/hooks/get-supabase-user';
import StarIcon from '@/shared/assets/icons/star.svg';
import Image from 'next/image';
import GeneralAIInput from './_ui/general-ai-input';
import SpecificAIButtons from './_ui/specific-ai-buttons';
import QuickPersonTargetRecommendation from './_ui/quick-person-target-recommendation';
import PopularFlowerRecommendation from './_ui/popular-flower-recommendation';

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
    <div className='flex min-h-screen items-center justify-center relative'>
      {/* 상단 배경 이미지 */}
      <Image
        src='/images/bg_home_top.png'
        alt='main'
        width={360}
        height={380}
        className='absolute top-[-48px] left-0 w-full h-[380px] object-cover'
      />
      <div className='absolute inset-0'>
        <div className='px-4 py-5'>
          <p className='px-1 text-title-lg text-white whitespace-pre-wrap'>
            {'어떤 꽃으로 마음을\n전하고 싶으신가요?'}
          </p>
          <span className='pt-5 px-micro flex items-center gap-1'>
            <StarIcon className='w-3 h-3 text-gray-50'/>
            <p className='text-body-xsm text-gray-50'>입력한 내용에 따라 AI가 꽃을 추천해 드려요.</p>
          </span>
          <GeneralAIInput />
          <SpecificAIButtons/>
        </div>
        {/* 빠른 대상 추천 */}
        <QuickPersonTargetRecommendation />
        {/* 인기 꽃 추천 */}
        <PopularFlowerRecommendation />

      </div>
      {/* <p className='text-center text-lg font-semibold text-zinc-900'>{heroText}</p> */}
    </div>
  );
}
