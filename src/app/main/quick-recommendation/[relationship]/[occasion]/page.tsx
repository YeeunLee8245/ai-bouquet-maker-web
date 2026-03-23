'use client';

import { OCCASION_OBJECT, TOccasion } from '@/entities/occasion';
import { notFound, useParams } from 'next/navigation';
import { TRelationship } from '../types';
import OccasionDescription from '@/entities/occasion/ui/occasion-description';
import { QUICK_RECOMMENDATION_DATA_MAP } from '../_datas';
import { FlowerCard } from '@/entities/flower/ui';
import { useQuery } from '@tanstack/react-query';
import { fetchPresetRecommendations } from '@api/recommend-preset.api';
import { FlowerCardSkeleton } from '@/shared/ui/skeleton';
import { useSetAtom } from 'jotai';
import { resetSelectedFlowersAtom } from '@/shared/model/selected-flowers';
import { SelectButton } from '@features/select-flower';
import { useEffect } from 'react';

function QuickRecommendationOccasionPage() {
  const { relationship, occasion } = useParams<{ relationship: TRelationship; occasion: TOccasion }>();
  const resetSelectedFlowers = useSetAtom(resetSelectedFlowersAtom);
  if (!OCCASION_OBJECT[occasion]) {
    notFound();
  }

  const { data, isPending } = useQuery({
    queryKey: ['preset-recommendations', relationship, occasion],
    queryFn: () => fetchPresetRecommendations(relationship, occasion),
  });

  useEffect(() => {
    resetSelectedFlowers();
  }, []);

  return (
    <div>
      <OccasionDescription
        type={occasion}
        title={`${QUICK_RECOMMENDATION_DATA_MAP[relationship]} ${OCCASION_OBJECT[occasion].label} 추천 꽃`}
        description={OCCASION_OBJECT[occasion].description}
      />
      <div className='p-4 grid grid-cols-2 gap-x-4 gap-y-8'>
        {isPending
          ? Array.from({ length: 6 }).map((_, i) => <FlowerCardSkeleton key={i} />)
          : data?.recommendations.map((rec) => (
            <FlowerCard
              key={rec.id}
              size='lg'
              id={String(rec.id)}
              name={rec.name}
              tags={rec.tags}
              colors={rec.colors}
              imageUrl={rec.imageUrl ?? ''}
              actionButton={<SelectButton flowerId={String(rec.id)} flowerName={rec.name} />}
            />
          ))}
      </div>
    </div>
  );
}

export default QuickRecommendationOccasionPage;
