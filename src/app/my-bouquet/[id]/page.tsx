import MakeBouquetPreviewContainer from '@/app/make-bouquet/_ui/make-bouquet-preview-container';
import MyBouquetInfo from './_ui/my-bouquet-info';
import MyBouquetComposition from './_ui/my-bouquet-composition';
import MyBouquetPackaging from './_ui/my-bouquet-packaging';
import { Button } from '@/shared/ui/button';

/**
 * 내 꽃다발 상세 페이지
 */
const MyBouquetDetailPage = () => {
  return (
    <div className=''>
      <div className='p-4 flex items-end justify-between'>
        <p className='text-title-lg'>꽃다발 이름</p>
        <div className='text-end text-body-xsm text-gray-400 whitespace-pre-wrap'>
          {`${'2025년 12월 4일'}\n${'09:00'}`}
        </div>
      </div>
      <div className='flex flex-col gap-4 px-4 pb-6'>
        {/* TODO: yeeun 공통화 */}
        <MakeBouquetPreviewContainer/>
        <MyBouquetInfo/>
        <MyBouquetComposition/>
        <MyBouquetPackaging/>
      </div>
      <div className='px-4 pb-8 flex flex-col items-center'>
        <Button size='lg' className='w-full'>
          꽃다발 수정
        </Button>
        <button className='w-fit px-2 text-gray-400 text-ui-textbtn-lg hover:text-primary-600 hover:bg-gray-100 hover:rounded-4'>
          공유하기
        </button>
      </div>
    </div>
  );
};

export default MyBouquetDetailPage;
