import LogoIcon from '@/shared/assets/icons/logo.svg';
import PrimaryTitleIcon from '@/shared/assets/icons/primary_title.svg';
import Link from 'next/link';

function PcFooter() {
  return (
    <footer className='hidden pc:flex flex-col gap-4 pt-8 pb-8 px-8 bg-gray-100'>
      <div className='flex items-center'>
        <LogoIcon className='ml-[5px] mr-[7.8px] w-[21px] h-[21.8px] fill-primary-600' />
        <PrimaryTitleIcon />
      </div>
      <div className='flex flex-col gap-1'>
        <Link href='/info' className='text-ui-textbtn-lg text-gray-700'>서비스 소개</Link>
        <div className='flex items-center gap-2'>
          <p className='text-ui-textbtn-lg text-gray-700'>문의</p>
          <p className='text-ui-textbtn-md text-gray-400'>contact@todaysflower.com</p>
        </div>
      </div>
    </footer>
  );
}

export default PcFooter;
