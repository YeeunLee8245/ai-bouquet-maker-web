'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import BouquetListItem from './_ui/bouquet-list-item';
import { useBouquetListQuery } from './_model/use-bouquet-list-query';
import { toComponentBouquet } from './_model/bouquet-list-mapper';
import PlusIcon from '@/shared/assets/icons/plus.svg';

/**
 * 내 꽃다발 목록 페이지
 */
const MyBouquetPage = () => {
  const { data, isLoading, refetch } = useBouquetListQuery();
  const bouquets = (data?.bouquets ?? []).map(toComponentBouquet);

  const [isCheckableMode, setIsCheckableMode] = useState<boolean>(false);

  // TODO: yeeun isLoading true -> shimmer 추가
  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <p className='text-body-md text-gray-400'>불러오는 중...</p>
      </div>
    );
  }
  const {total} = data ?? {};

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* 헤더 */}
      <div className='mx-4 px-micro pt-4 pb-2 flex items-center justify-between'>
        <p className='text-title-lg'>내 꽃다발</p>
        <Button size='sm' asChild>
          <Link href='/main/ai-prompt/emotion'>
            <PlusIcon className='w-[9px] h-[9px] mx-[3.5px]' />
            <p className='text-ui-cta-sm text-primary-600 hover:text-primary-200'>새 꽃다발 만들기</p>
          </Link>
        </Button>
      </div>
      <div className='h-[2px] w-full bg-gray-100'/>

      <div className='pt-4 px-4 pb-8'>
        {/* TODO: yeeun 컴포넌트 분리 */}
        {/* 전체 개수 + 선택 버튼 */}
        <span className='flex items-center justify-between'>
          <p className='text-ui-label-sm text-gray-400'>{total}개의 꽃다발</p>
          <button onClick={() => setIsCheckableMode((prev) => !prev)} className='text-body-sm rounded-3 hover:bg-gray-100 hover:text-primary-600'>
            {isCheckableMode ? '완료' : '선택'}
          </button>
        </span>
        {/* TODO: yeeun 컴포넌트 분리 */}
        {/* 목록 */}
        <div className='pt-3 flex flex-col gap-4'>
          {bouquets.map((bouquet) => (
            <BouquetListItem
              key={bouquet.id}
              bouquet={bouquet}
              onDeleteSuccess={refetch}
              // isSelected={selectedIds.includes(bouquet.id)}
              // onSelect={() => handleToggleSelect(bouquet.id)}
            />
          ))}
          {total === 0 && (
            <div className='flex flex-col items-center justify-center py-20 gap-2'>
              <p className='text-body-md text-gray-400 text-center whitespace-pre-wrap'>
                {'저장된 꽃다발이 없어요🥹\n바로 위 버튼을 눌러 새 꽃다발을 만들어 보세요!'}
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default MyBouquetPage;
