import Image from 'next/image';
import Link from 'next/link';

const FEATURES = [
  {
    title: 'AI 맞춤 추천',
    description: '감정이나 상황 등을 알려주시면\nAI가 적합한 꽃을 찾아드려요.',
    href: '/main',
  },
  {
    title: '꽃 사전',
    description: '다양한 꽃의 의미와 관리법을 알아보고\n계절별 꽃 정보를 확인해 보세요.',
    href: '/flower-directory',
  },
  {
    title: '꽃다발 만들기',
    description: '특별한 마음을 담은 꽃다발을\n직접 구성해 보세요.',
    href: '/make-bouquet',
  },
] as const;

const PRIVACY_POLICY = `## 개인정보의 보유 및 이용기간

  수집목적 또는 제공받은 목적이 달성된 경우에도 전자상거래 등에서의 소비자보호에 관한 법률, 개인정보보호법, 상법, 국세기본법 등 법령의 규정에 의하여 보존할 필요성이 있는 경우에는 다음과 같이 일정기간 이용자의 개인정보를 보유할 수 있습니다.
* 계약 또는 청약철회 등에 관한 기록 : 5년
* 대금결제 및 재화 등의 공급에 관한 기록 : 5년
* 소비자의 불만 또는 분쟁처리에 관한 기록 : 3년
* 본인확인에 관한 기록 : 6개월
* 방문에 관한 기록 : 3개월

## 개인정보의 파기절차 및 방법

  이용자의 개인정보는 수집 및 이용목적이 달성된 후 별도의 DB로 옮겨져(종이의 경우 별도의 서류함) 내부 방침 및 기타 관련 법령에 의한 정보보호 사유에 따라 일정 기간 저장된 후 파기됩니다.`;

export default function InfoPage() {
  return (
    <div className='flex w-full flex-col'>
      {/* 상단 히어로 영역 */}
      <section className='relative h-[120px] shrink-0'>
        <Image
          src='/images/bg_main_top.webp'
          alt=''
          priority
          width={360}
          height={120}
          className='absolute inset-0 w-full h-full object-cover object-top'
        />
        <div className='absolute inset-0 px-5 flex items-end pb-5'>
          <h1 className='text-title-lg text-white'>서비스 소개</h1>
        </div>
      </section>

      {/* 기능 카드 목록 */}
      <section className='flex flex-col gap-3 px-4 py-4'>
        {FEATURES.map((feature) => (
          <Link
            key={feature.title}
            href={feature.href}
            className='block w-full rounded-2xl bg-white px-5 py-4 shadow-sm'
          >
            <p className='text-body-lg text-gray-700 mb-1'>{feature.title}</p>
            <p className='text-body-xsm text-gray-400 whitespace-pre-line'>{feature.description}</p>
          </Link>
        ))}
      </section>

      {/* 개인정보 처리방침 */}
      <section className='mt-2 bg-white px-5 py-6'>
        <h2 className='text-body-lg text-gray-700 mb-4'>개인정보 처리방침</h2>
        <div className='text-body-xsm text-gray-400 whitespace-pre-line leading-relaxed'>
          {PRIVACY_POLICY}
        </div>
      </section>
    </div>
  );
}
