import PageScroll from '@/app/_ui/page-scroll';
import { Markdown } from '@/shared/ui/markdown';
import { PRIVACY_POLICY, WITHDRAWAL_TERMS } from './_datas/info-content';
import HeroBackground from '../main/_ui/hero-background';
import InfoRouteCards from './_ui/info-route-cards';

export default function InfoPage() {
  return (
    <PageScroll className='relative w-full flex-1 min-h-0'>
      {/* 히어로 영역 - 타이틀 + 기능 카드 목록 */}
      <section className='relative shrink-0'>
        <HeroBackground />
        <div className='relative px-4 py-5 tablet:px-6 pc:px-8'>
          <h1 className='text-title-lg text-white px-1'>서비스 소개</h1>
        </div>
        {/* 기능 카드 목록 */}
        <InfoRouteCards />
      </section>

      {/* 약관 영역 */}
      <div className='flex flex-col gap-4 tablet:gap-6 pc:gap-8 pb-4 tablet:pb-6 pc:pb-8'>

        {/* 구분선 */}
        <div className='h-[2px] bg-gray-100' />

        {/* 개인정보 처리방침 + 회원탈퇴 약관 */}
        <section className='flex flex-col gap-3 px-4 tablet:px-6 pc:px-8'>
          <div className='rounded-[12px] border border-gray-100 bg-white px-5 py-4'>
            <div className='flex flex-col gap-2 py-[2px]'>
              <h2 className='text-title-md text-gray-700'>
                개인정보 처리방침
              </h2>
              <Markdown>{PRIVACY_POLICY}</Markdown>
            </div>
          </div>

          <div className='rounded-[12px] border border-gray-100 bg-white px-5 py-4'>
            <div className='flex flex-col gap-2 py-[2px]'>
              <h2 className='text-title-md text-gray-700'>
                회원탈퇴 약관 조항
              </h2>
              <Markdown>{WITHDRAWAL_TERMS}</Markdown>
            </div>
          </div>
        </section>
      </div>
    </PageScroll>
  );
}
