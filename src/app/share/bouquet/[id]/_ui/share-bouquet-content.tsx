'use client';

import Link from 'next/link';
import MyBouquetInfo from '@/app/my-bouquet/[id]/_ui/my-bouquet-info';
import MyBouquetComposition from '@/app/my-bouquet/[id]/_ui/my-bouquet-composition';
import MyBouquetPackaging from '@/app/my-bouquet/[id]/_ui/my-bouquet-packaging';
import BouquetPreviewSection from '@/app/my-bouquet/[id]/_ui/bouquet-preview-section';
import { Button } from '@/shared/ui/button';
import type { IBouquetDetailData } from '@/app/my-bouquet/[id]/_types';

type TProps = {
  data: IBouquetDetailData;
  sig: string;
};

export default function ShareBouquetContent({ data, sig }: TProps) {
  const createdDate = new Date(data.created_at);
  const formattedDate = createdDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = createdDate.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  // 복사 생성용 링크 조립
  const copyUrl = sig
    ? `/make-bouquet?copy=${data.id}&sig=${sig}`
    : `/make-bouquet?copy=${data.id}`;

  return (
    <div className='bg-gray-50 min-h-screen'>
      <div className='p-4 flex items-end justify-between'>
        <p className='text-title-lg'>{data.name}</p>
        <div className='text-end text-body-xsm text-gray-400 whitespace-pre-wrap'>
          {`${formattedDate}\n${formattedTime}`}
        </div>
      </div>
      <div className='h-px bg-gray-100' />
      <div className='px-4 pt-4 pb-8'>
        <div className='tablet:grid tablet:grid-cols-2 tablet:gap-6 tablet:items-start'>
          <div className='flex flex-col gap-4'>
            <MyBouquetInfo
              occasion={data.occasion}
              recipient={data.recipient}
              message={data.message === null ? '비공개 메시지입니다.' : data.message}
            />
            <MyBouquetComposition flowers={data.flowers} />
            <MyBouquetPackaging wrapping={data.wrapping} />
          </div>
          <div className='flex flex-col gap-4'>
            <div className='info-border p-4'>
              <div className='px-micro'>
                <p className='text-title-md'>꽃다발 미리보기</p>
                <p className='mt-1 text-body-md text-gray-400 whitespace-pre-wrap'>
                  실제 꽃다발은 플로리스트가 더 예쁘게{'\n'}만들어 드려요.
                </p>
              </div>
              <div className='mt-3'>
                <BouquetPreviewSection flowers={data.flowers} layout={data.layout} />
              </div>
            </div>
            <div className='flex flex-col gap-3 items-center w-full'>
              <Button size='lg' className='w-full' asChild>
                <Link href={copyUrl}>이 꽃다발 복사해서 만들기</Link>
              </Button>
              <Button 
                size='lg' 
                className='bg-white text-primary-400 border-1 border-primary-400 hover:bg-primary-50 hover:text-primary-600 w-full' 
                asChild
              >
                <Link href='/make-bouquet'>나만의 꽃다발 만들기</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
