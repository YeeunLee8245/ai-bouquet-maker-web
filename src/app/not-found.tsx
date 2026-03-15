import Link from 'next/link';
import CautionIcon from '@/shared/assets/icons/caution.svg';
import Button from '@/shared/ui/button/button';

export default function NotFound() {
  return (
    <div className='flex flex-col items-center h-full px-4 pt-11 gap-11'>
      <div className='flex flex-col items-center gap-5'>
        <CautionIcon className='w-[24px] h-[24px] fill-error' />
        <p className='text-title-lg text-center text-gray-700'>
          이 페이지는 존재하지 않아요.<br />
          혹시 주소를 잘못 입력하셨나요?
        </p>
      </div>
      <Button size='lg' asChild>
        <Link href='/main'>홈으로 돌아가기</Link>
      </Button>
    </div>
  );
}
