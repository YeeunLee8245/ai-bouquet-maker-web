'use client';

import React from 'react';
import { QUICK_PERSON_TARGET_RECOMMENDATION_LIST } from '../../_datas';
import { notFound, useParams } from 'next/navigation';
import { QUICK_RECOMMENDATION_DATA_MAP } from './_datas';
import { OccasionItem, TOccasion } from '@/entities/occasion';
import { useQuery } from '@tanstack/react-query';
import { fetchPresetOccasions } from '@api/recommend-preset.api';
import { OccasionItemSkeleton } from '@/shared/ui/skeleton';

type TRelationship = (typeof QUICK_PERSON_TARGET_RECOMMENDATION_LIST)[number]['id'];

function QuickRecommendationPage() {
  const params = useParams<{ relationship: TRelationship }>();
  const relationship = params.relationship;

  if (!QUICK_RECOMMENDATION_DATA_MAP[relationship]) {
    notFound();
  }

  const { data: occasions, isPending } = useQuery({
    queryKey: ['preset-occasions', relationship],
    queryFn: () => fetchPresetOccasions(relationship),
  });

  return (
    <div>
      <div className='px-5 pt-4 pb-2'>
        <div className='text-title-lg'>
          {`${QUICK_RECOMMENDATION_DATA_MAP[relationship]}에게 전할 꽃`}
        </div>
        <div className='mt-micro text-body-md text-gray-400'>
          어떤 상황에 전달할 꽃인가요?
        </div>
      </div>
      <div className='grid grid-cols-2 gap-4 px-4 pt-4 pb-8'>
        {isPending
          ? Array.from({ length: 4 }).map((_, i) => <OccasionItemSkeleton key={i} />)
          : occasions?.map((item) => (
            <OccasionItem key={item.value} relationship={relationship} type={item.value as TOccasion} />
          ))}
      </div>
    </div>
  );
}

export default QuickRecommendationPage;
