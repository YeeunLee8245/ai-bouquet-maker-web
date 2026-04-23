'use client';

import CautionIcon from '@/shared/assets/icons/caution.svg';
import Button from '@/shared/ui/button/button';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className='flex flex-col items-center h-full px-4 pt-11 gap-11'>
      <div className='flex flex-col items-center gap-5'>
        <CautionIcon className='w-[24px] h-[24px] fill-error' />
        <p className='text-title-lg text-center text-gray-700'>
          페이지를 불러올 수 없어요.<br />
          잠시 후 다시 시도해 주세요.
        </p>
      </div>
      <Button size='lg' onClick={reset}>다시 시도</Button>
    </div>
  );
}
