import Link from 'next/link';
import PageScroll from '@/app/_ui/page-scroll';
import { FEATURES, PRIVACY_POLICY, WITHDRAWAL_TERMS } from './_datas/info-content';
import HeroBackground from '../main/_ui/hero-background';

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
        <div className='relative flex flex-col gap-3 px-4 pb-4 tablet:px-6 pc:px-8 tablet:pb-6 pc:pb-8'>
          {FEATURES.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className='block w-full rounded-[12px] border border-gray-100 bg-white px-5 py-4'
            >
              <div className='flex flex-col gap-1 py-[2px]'>
                <p className='text-title-md text-gray-700'>
                  {feature.title}
                </p>
                <p className='text-body-lg text-gray-400 whitespace-pre-line'>
                  {feature.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
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
              <p className='text-body-md text-gray-400 whitespace-pre-wrap'>
                {PRIVACY_POLICY}
              </p>
            </div>
          </div>

          <div className='rounded-[12px] border border-gray-100 bg-white px-5 py-4'>
            <div className='flex flex-col gap-2 py-[2px]'>
              <h2 className='text-title-md text-gray-700'>
                회원탈퇴 약관 조항
              </h2>
              <p className='text-body-md text-gray-400 whitespace-pre-wrap'>
                {WITHDRAWAL_TERMS}
              </p>
            </div>
          </div>
        </section>
      </div>
    </PageScroll>
  );
}
