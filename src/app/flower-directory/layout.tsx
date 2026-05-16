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
import { BREAKPOINTS } from '@/shared/constants/breakpoints';

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
  const isPcUp = useMediaQuery(`(min-width: ${BREAKPOINTS.PC})`);

  useEffect(() => {
    resetSelectedFlowers();
  }, []);

  // 꽃다발 만들기 버튼 표시 여부
  // 꽃 사전 리스트 페이지 || 꽃 사전 리스트 > 꽃 상세 페이지
  const canCreateBouquet =
    pathname === '/flower-directory' || searchParams.get('can-create-bouquet') === 'true';

  if (!canCreateBouquet) {return null;}

  return (
    <ActionBar>
      <SelectedFlowerChips flowers={flowers} onRemove={removeFlower} twoLineThreshold={isPcUp} />
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
