'use client';

import { useParams } from 'next/navigation';
import MyBouquetInfo from './_ui/my-bouquet-info';
import MyBouquetComposition from './_ui/my-bouquet-composition';
import MyBouquetPackaging from './_ui/my-bouquet-packaging';
import BouquetDetailSkeleton from './_ui/bouquet-detail-skeleton';
import { Button } from '@/shared/ui/button';
import { useBouquetDetailQuery } from './_model/use-bouquet-detail-query';
import Link from 'next/link';
import { openModalAtom } from '@/shared/model/modal/modal.actions';
import { showToastAtom } from '@/shared/model/toast';
import { useSetAtom } from 'jotai';
import BouquetPreviewModal from './_ui/bouquet-preview-modal';

const MyBouquetDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useBouquetDetailQuery(id);
  const openModal = useSetAtom(openModalAtom);
  const showToast = useSetAtom(showToastAtom);

  if (isLoading) {
    return <BouquetDetailSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[50vh] gap-4'>
        <p className='text-body-md text-gray-400'>꽃다발을 찾을 수 없습니다.</p>
        <Button size='sm' asChild>
          <Link href='/main'>메인으로 돌아가기</Link>
        </Button>
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

  const handleShareClick = async () => {
    const url = `${window.location.origin}/my-bouquet/${id}`;
    if (navigator.share) {
      await navigator.share({ title: data.name, url });
    } else {
      await navigator.clipboard.writeText(url);
      showToast({ message: '공유 주소 복사 완료!' });
    }
  };

  const handlePreviewClick = () => {
    openModal({
      id: 'bouquet-preview-modal',
      position: 'bottom',
      canCloseOnBackgroundClick: true,
      component: <BouquetPreviewModal flowers={data.flowers} layout={data.layout} />,
    });
  };

  return (
    <div className='bg-gray-50 min-h-screen'>
      <div className='p-4 flex items-end justify-between'>
        <p className='text-title-lg'>{data.name}</p>
        <div className='text-end text-body-xsm text-gray-400 whitespace-pre-wrap'>
          {`${formattedDate}\n${formattedTime}`}
        </div>
      </div>
      <div className='h-px bg-gray-100' />
      <div className='flex flex-col gap-6 px-4 pt-4 pb-8'>
        <div className='flex flex-col gap-4'>
          <button type='button' aria-label='꽃다발 미리보기' className='info-border p-4 hover:border-gray-200 hover:shadow-sm' onClick={handlePreviewClick}>
            <div className='px-micro'>
              <p className='text-title-md text-start'>꽃다발 미리보기</p>
              <p className='mt-1 text-body-md text-gray-400 text-start whitespace-pre-wrap'>
                실제 꽃다발은 플로리스트가 더 예쁘게{'\n'}만들어 드려요.
              </p>
            </div>
          </button>
          <MyBouquetInfo
            occasion={data.occasion}
            recipient={data.recipient}
            message={data.message}
          />
          <MyBouquetComposition flowers={data.flowers} />
          <MyBouquetPackaging wrapping={data.wrapping} />
        </div>
        <div className='flex flex-col gap-3 items-center'>
          <Button size='lg' className='w-full' asChild>
            <Link href={`/my-bouquet/${id}/modify`}>꽃다발 수정</Link>
          </Button>
          <button
            className='w-fit px-2 text-gray-400 text-ui-textbtn-lg hover:text-primary-600 hover:bg-gray-100 hover:rounded-4'
            onClick={handleShareClick}
          >
            공유하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyBouquetDetailPage;
