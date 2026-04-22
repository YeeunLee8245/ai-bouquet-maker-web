'use client';

import CautionIcon from '@/shared/assets/icons/caution.svg';
import Button from '@/shared/ui/button/button';

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang='ko'>
      <body>
        <div className='flex flex-col items-center h-full px-4 pt-11 gap-11'>
          <div className='flex flex-col items-center gap-5'>
            <CautionIcon className='w-[24px] h-[24px] fill-error' />
            <p className='text-title-lg text-center text-gray-700'>
              문제가 발생했어요.<br />
              잠시 후 다시 시도해 주세요.
            </p>
          </div>
          <Button size='lg' onClick={reset}>다시 시도</Button>
        </div>
      </body>
    </html>
  );
}
