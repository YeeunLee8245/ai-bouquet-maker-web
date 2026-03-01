'use client';
import BottomActionFooter from '@/widgets/footer/bottom-action-footer';
import { usePathname, useSearchParams } from 'next/navigation';

type TProps = {
  children: React.ReactNode;
  modal: React.ReactNode;
};

export default function FlowerDirectoryLayout({ children, modal }: TProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // 꽃 사전 페이지 또는 꽃 상세 페이지에서 꽃다발 만들기 버튼 표시
  const canCreateBouquet = pathname === '/flower-directory' || searchParams.get('can-create-bouquet') === 'true';

  return (
    <div className='relative h-full flex flex-col'>
      <div className='relative flex flex-1 overflow-y-auto'>
        {children}
        {modal}
      </div>
      {canCreateBouquet && <BottomActionFooter title='꽃다발 만들기' />}
    </div>
  );
}
