'use client';

import React from 'react';
import { QUICK_PERSON_TARGET_RECOMMENDATION_LIST } from '../../_datas';
import { notFound, useParams } from 'next/navigation';
import { QUICK_RECOMMENDATION_DATA_MAP } from './_datas';
import { OccasionItem, OCCASION_OBJECT, TOccasion } from '@/entities/occasion';

type TRelationship = (typeof QUICK_PERSON_TARGET_RECOMMENDATION_LIST)[number]['id'];

function QuickRecommendationPage() {
  const params = useParams<{ relationship: TRelationship }>();
  const relationship = params.relationship;

  if (!QUICK_RECOMMENDATION_DATA_MAP[relationship]) {
    notFound();
  }

  return (
    <div>
      <div className='px-5 pt-4 pb-2'>
        <div
          className='text-title-lg'
        >
          {`${QUICK_RECOMMENDATION_DATA_MAP[relationship]}에게 전할 꽃`}
        </div>
        <div
          className='mt-micro text-body-md text-gray-400'
        >
          어떤 상황에 전달할 꽃인가요?
        </div>
      </div>
      <div className='grid grid-cols-2 gap-4 px-4 pt-4 pb-8'>
        {/* TODO: yeeun API 응답으로 변경 */}
        {Object.keys(OCCASION_OBJECT).map((type) => (
          <OccasionItem key={type} relationship={relationship} type={type as TOccasion} />
        ))}
      </div>
    </div>
  );
}

export default QuickRecommendationPage;
