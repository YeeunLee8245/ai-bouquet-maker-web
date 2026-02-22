'use client';

import { OCCASION_OBJECT, TOccasion } from '@/entities/occasion';
import { useParams } from 'next/navigation';
import { TRelationship } from '../types';
import OccasionDescription from '@/entities/occasion/ui/occasion-description';
import { QUICK_RECOMMENDATION_DATA_MAP } from '../_datas';
import { FlowerCard } from '@/entities/flower/ui';
import { testDirectoryItem } from '@/app/flower-directory/_datas';
import { Button } from '@/shared/ui/button';

function QuickRecommendationOccasionPage() {
  const {relationship, occasion} = useParams<{relationship: TRelationship; occasion: TOccasion}>();

  return (
    <div>
      <OccasionDescription
        type={occasion}
        title={`${QUICK_RECOMMENDATION_DATA_MAP[relationship]} ${OCCASION_OBJECT[occasion].label} 추천 꽃`}
        description={OCCASION_OBJECT[occasion].description}
      />
      <div className='p-4 grid grid-cols-2 gap-x-4 gap-y-8 '>
        {/* TODO: yeeun API 응답으로 변경, entities로 빼기 */}
        {Array.from({ length: 10 }).map((_, index) => (
          <FlowerCard
            key={index}
            size='lg'
            {...testDirectoryItem}
            actionButton={<Button size='md' onClick={() => {}} className='mt-3'>선택하기</Button>}/>
        ))}
      </div>
    </div>
  );
}

export default QuickRecommendationOccasionPage;
