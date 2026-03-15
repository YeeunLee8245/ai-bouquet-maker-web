import StarIcon from '@/shared/assets/icons/star.svg';
import Image from 'next/image';
import GeneralAIInput from './_ui/general-ai-input';
import SpecificAIButtons from './_ui/specific-ai-buttons';
import QuickPersonTargetRecommendation from './_ui/quick-person-target-recommendation';
import PopularFlowerRecommendation from './_ui/popular-flower-recommendation';
import TodayFlowerContainer from './_ui/today-flower-container';
import { getMainData } from '../api/main/getMainData';
import NewUserModalTrigger from './_ui/new-user-modal-trigger';
// 맞춤 추천 -> 따로 페이지 빼는 것이 아닌 컴포넌트 형태로 중첩해서 띄우기
/**
 * 메인 페이지
 */
export default async function MainPage({ searchParams }: { searchParams: Promise<{ is_new_user?: string }> }) {
  const [data, params] = await Promise.all([getMainData(), searchParams]);
  const isNewUser = params.is_new_user === 'true';

  return (
    <div className='flex w-full h-full min-h-0 flex-col'>
      <NewUserModalTrigger isNewUser={isNewUser} />
      <div className='relative w-full flex-1 min-h-0 overflow-y-auto'>
        {/* 상단: 배경 이미지 + 히어로 영역 (스크롤 시 함께 올라가서 사라짐) */}
        <section className='relative h-[380px] shrink-0'>
          <Image
            src='/images/bg_main_top.webp'
            alt=''
            priority
            width={360}
            height={380}
            className='absolute inset-0 w-full h-full object-cover object-[50%_-48px]'
          />
          <div className='absolute inset-0 px-4 py-5'>
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
        </section>
        {/* 빠른 대상 추천 */}
        <QuickPersonTargetRecommendation recipients={data?.recipients} />
        {/* 인기 꽃 추천 */}
        <PopularFlowerRecommendation flowers={data?.popularFlowers} />
        {/* 오늘의 추천 꽃 */}
        <TodayFlowerContainer flower={data?.todaysFlower} />
      </div>
    </div>
  );
}
