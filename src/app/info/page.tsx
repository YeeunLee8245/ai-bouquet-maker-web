import Image from 'next/image';
import Link from 'next/link';
import PageScroll from '@/app/_ui/page-scroll';
import { FEATURES, PRIVACY_POLICY, WITHDRAWAL_TERMS } from './_datas/info-content';

export default function InfoPage() {
  return (
    <PageScroll>
      <div className='flex w-full flex-col'>
        {/* 히어로 배경 영역 */}
        <div className='relative h-[380px] tablet:h-[480px] pc:h-[560px] shrink-0'>
          <Image
            src='/images/bg_main_top.webp'
            alt=''
            priority
            fill
            className='object-cover object-top'
          />
          <div className='absolute inset-0 bg-primary-400/64 backdrop-blur-[50px]' />
          <div
            className='absolute inset-x-0 bottom-0 h-[140px] tablet:h-[200px]'
            style={{
              backgroundImage:
                'linear-gradient(to bottom, transparent, var(--color-gray-50))',
            }}
          />
          <div
            className='absolute inset-x-0 top-0 h-full'
            style={{
              backgroundImage:
                'linear-gradient(to bottom, transparent 60%, var(--color-gray-50))',
            }}
          />
        </div>

        {/* 콘텐츠 영역 - 히어로 위에 겹침 */}
        <div className='-mt-[280px] tablet:-mt-[340px] pc:-mt-[400px] relative z-[1] flex flex-col'>
          {/* 서비스 소개 타이틀 */}
          <div className='px-4 tablet:px-6 pc:px-8 pb-4'>
            <h1 className='text-title-lg text-white px-1'>서비스 소개</h1>
          </div>

          {/* 기능 카드 + 약관 영역 */}
          <div className='flex flex-col gap-4 tablet:gap-6 pc:gap-8'>
            {/* 기능 카드 목록 */}
            <section className='flex flex-col gap-3 px-4 tablet:px-6 pc:px-8'>
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
            </section>

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
        </div>
      </div>
    </PageScroll>
  );
}
