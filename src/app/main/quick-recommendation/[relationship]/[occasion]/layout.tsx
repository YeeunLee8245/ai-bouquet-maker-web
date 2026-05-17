'use client';
import { ActionBar } from '@/shared/ui/action-bar';
import { SelectedFlowerChips } from '@/entities/flower/ui';
import { Button } from '@/shared/ui/button';
import { useMakeBouquet } from '@features/bouquet-form';
import { useMediaQuery } from '@/shared/hooks/useMediaQuery';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  selectedFlowersAtom,
  removeFlowerAtom,
  SelectedFlowersInitializer,
} from '@/entities/flower/model/selected-flowers';
import PageScroll from '@/app/_ui/page-scroll';

function QuickRecommendationOccasionLayout({ children }: { children: React.ReactNode }) {
  const flowers = useAtomValue(selectedFlowersAtom);
  const removeFlower = useSetAtom(removeFlowerAtom);
  const { handleMakeBouquet } = useMakeBouquet({ fromAiPrompt: true });
  const isPc = useMediaQuery('(min-width: 1024px)');

  return (
    <div className='relative h-full flex flex-col'>
      <PageScroll hidePcFooter className='relative flex flex-1'>
        {children}
      </PageScroll>
      <SelectedFlowersInitializer />
      <ActionBar>
        <SelectedFlowerChips flowers={flowers} onRemove={removeFlower} twoLineThreshold={isPc} />
        <Button
          size='lg'
          className='pc:w-[360px] pc:shrink-0'
          onClick={handleMakeBouquet}
        >
          꽃다발 만들기
        </Button>
      </ActionBar>
    </div>
  );
}

export default QuickRecommendationOccasionLayout;
