import { Button } from '@/shared/ui/button';
import Link from 'next/link';
import React from 'react';

type TProps = {
  title: string;
  // TODO: yeeun onActionClick 이벤트 동작 추가
};

function BottomActionFooter({ title }: TProps) {

  return (
    <footer className='py-3 px-4 pb-8 w-full flex flex-col gap-4' style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}>
      <div>
        <span className='text-ui-label-sm text-gray-400'>
          선택한 꽃
        </span>
        {/* TODO: yeeun 선택한 꽃 목록 추가 */}
      </div>
      <Button size='lg' asChild>
        <Link href='/create-bouquet'>{title}</Link>
      </Button>
    </footer>
  );
}

export default BottomActionFooter;
