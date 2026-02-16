import { Button } from '@/shared/ui/button';
import ProfileDescriptionContainer from './_ui/profile-description-container';

/**
 * 내 프로필 페이지
 */
const MyProfilePage = () => {
  return (
    <div className='p-4 flex flex-col bg-white'>
      <div className='flex justify-between items-center'>
        <span className='px-micro text-[20px] font-medium leading-[28px] tracking-[-0.08px]'>내 프로필</span>
        <Button size='sm'>
          수정
        </Button>
      </div>
      <ProfileDescriptionContainer />
      <button className='text-ui-textbtn-lg text-gray-400'>
        로그아웃
      </button>
    </div>
  );
};

export default MyProfilePage;
