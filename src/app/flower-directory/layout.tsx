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
  resetSelectedFlowersAtom,
} from '@/entities/flower/model/selected-flowers';
import PageScroll from '@/app/_ui/page-scroll';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

type TProps = {
  children: React.ReactNode;
  modal: React.ReactNode;
};

/**
 * 꽃다발 만들기 버튼 Suspense 레이아웃
 */
function BottomActionFooterContainer() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const resetSelectedFlowers = useSetAtom(resetSelectedFlowersAtom);
  const flowers = useAtomValue(selectedFlowersAtom);
  const removeFlower = useSetAtom(removeFlowerAtom);
  const { handleMakeBouquet } = useMakeBouquet();
  const isPc = useMediaQuery('(min-width: 1024px)');

  useEffect(() => {
    resetSelectedFlowers();
  }, []);

  const canCreateBouquet =
    pathname === '/flower-directory' || searchParams.get('can-create-bouquet') === 'true';

  if (!canCreateBouquet) {return null;}

  return (
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
  );
}

/**
 * 꽃 사전 레이아웃
 */
export default function FlowerDirectoryLayout({ children, modal }: TProps) {
  return (
    <Suspense fallback={null}>
      <div className='relative h-full flex flex-col'>
        <PageScroll className='relative flex flex-1' hidePcFooter>
          {children}
          {modal}
        </PageScroll>
        <BottomActionFooterContainer />
      </div>
    </Suspense>
  );
}
