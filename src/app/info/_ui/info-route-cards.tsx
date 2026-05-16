'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSetAtom } from 'jotai';
import { loginRequiredAtom } from '@/shared/model/login/login-guard.atoms';
import { useUserAuth } from '@/hooks/use-supabase-user';

const FEATURES = [
  {
    title: 'AI 맞춤 추천',
    description: '감정이나 상황 등을 알려주시면\nAI가 적합한 꽃을 찾아드려요.',
    href: '/main/ai-prompt/emotion',
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
];

export default function InfoRouteCards() {
  const router = useRouter();
  const setLoginRequired = useSetAtom(loginRequiredAtom);
  const { isLogin } = useUserAuth();

  const handleMakeBouquetClick = () => {
    if (!isLogin) {
      setLoginRequired({ isRequired: true, nextPath: '/make-bouquet' });
      return;
    }
    router.push('/make-bouquet');
  };

  return (
    <div className='relative flex flex-col gap-3 px-4 pb-4 tablet:px-6 pc:px-8 tablet:pb-6 pc:pb-8'>
      {FEATURES.map((feature) =>
        feature.href === '/make-bouquet' ? (
          <button
            key={feature.title}
            onClick={handleMakeBouquetClick}
            className='block w-full rounded-[12px] border border-gray-100 bg-white px-5 py-4 text-left'
          >
            <div className='flex flex-col gap-1 py-[2px]'>
              <p className='text-title-md text-gray-700'>{feature.title}</p>
              <p className='text-body-lg text-gray-400 whitespace-pre-line'>{feature.description}</p>
            </div>
          </button>
        ) : (
          <Link
            key={feature.title}
            href={feature.href}
            className='block w-full rounded-[12px] border border-gray-100 bg-white px-5 py-4'
          >
            <div className='flex flex-col gap-1 py-[2px]'>
              <p className='text-title-md text-gray-700'>{feature.title}</p>
              <p className='text-body-lg text-gray-400 whitespace-pre-line'>{feature.description}</p>
            </div>
          </Link>
        ),
      )}
    </div>
  );
}
