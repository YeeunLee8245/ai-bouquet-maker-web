'use client';

import { useParams } from 'next/navigation';
import MyBouquetInfo from './_ui/my-bouquet-info';
import MyBouquetComposition from './_ui/my-bouquet-composition';
import MyBouquetPackaging from './_ui/my-bouquet-packaging';
import BouquetDetailSkeleton from './_ui/bouquet-detail-skeleton';
import { Button } from '@/shared/ui/button';
import { useBouquetDetailQuery } from './_model/use-bouquet-detail-query';

const MyBouquetDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useBouquetDetailQuery(id);

  if (isLoading) {
    return <BouquetDetailSkeleton />;
  }

  if (!data) {
    return (
      <div className='flex items-center justify-center min-h-[50vh]'>
        <p className='text-body-md text-gray-400'>꽃다발을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const createdDate = new Date(data.created_at);
  const formattedDate = createdDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = createdDate.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <div className=''>
      <div className='p-4 flex items-end justify-between'>
        <p className='text-title-lg'>{data.name}</p>
        <div className='text-end text-body-xsm text-gray-400 whitespace-pre-wrap'>
          {`${formattedDate}\n${formattedTime}`}
        </div>
      </div>
      <div className='flex flex-col gap-4 px-4 pb-6'>
        {/* TODO: yeeun 공통화 */}
        {/* <MakeBouquetPreviewContainer/> */}
        <MyBouquetInfo
          occasion={data.occasion}
          recipient={data.recipient}
          message={data.message}
        />
        <MyBouquetComposition flowers={data.flowers} />
        <MyBouquetPackaging wrapping={data.wrapping} />
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
