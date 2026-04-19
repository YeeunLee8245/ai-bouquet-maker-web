'use client';
import BottomActionFooter from '@/widgets/footer/bottom-action-footer';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { resetSelectedFlowersAtom } from '@/entities/flower/model/selected-flowers';

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

  useEffect(() => {
    resetSelectedFlowers();
  }, []);
  // 꽃 사전 페이지 또는 꽃 상세 페이지에서 꽃다발 만들기 버튼 표시
  const canCreateBouquet = pathname === '/flower-directory' || searchParams.get('can-create-bouquet') === 'true';

  return (
    <>
      {canCreateBouquet && <BottomActionFooter title='꽃다발 만들기' />}
    </>
  );
}

/**
 * 꽃 사전 레이아웃
 */
export default function FlowerDirectoryLayout({ children, modal }: TProps) {

  return (
    <Suspense fallback={null}>
      <div className='relative h-full flex flex-col'>
        <div className='relative flex flex-1 overflow-y-auto'>
          {children}
          {modal}
        </div>
        <BottomActionFooterContainer />
      </div>
    </Suspense>
  );
}
