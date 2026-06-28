'use client';

import Link from 'next/link';
import MyBouquetInfo from './my-bouquet-info';
import MyBouquetComposition from './my-bouquet-composition';
import MyBouquetPackaging from './my-bouquet-packaging';
import BouquetPreviewSection from './bouquet-preview-section';
import { Button } from '@/shared/ui/button';
import { useBouquetDetailQuery } from '../_model/use-bouquet-detail-query';
import { useSetAtom } from 'jotai';
import { showToastAtom } from '@/shared/model/toast';
import { openModalAtom } from '@/shared/model/modal';
import { shareBouquet } from '@api/recipe-bouquet.api';
import ShareModal from './share-modal';

type TProps = {
  id: string;
};

export default function BouquetDetailContent({ id }: TProps) {
  const { data } = useBouquetDetailQuery(id);
  const showToast = useSetAtom(showToastAtom);

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

  const openModal = useSetAtom(openModalAtom);

  const handleShareClick = async () => {
    try {
      // 1. API를 호출해 공개 상태(is_public = true)로 전환
      await shareBouquet(id);

      // 2. 모달을 띄워 카드 메시지 포함 여부 및 공유 링크 복사 제공
      openModal({
        id: 'share-bouquet',
        component: (
          <ShareModal
            modalId='share-bouquet'
            bouquetId={id}
            bouquetName={data.name}
            messageSignature={data.messageSignature}
          />
        ),
        position: 'center',
      });
    } catch (error) {
      console.error('Failed to share bouquet:', error);
      showToast({ message: '공유 설정 중 오류가 발생했습니다.' });
    }
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
      <div className='px-4 pt-4 pb-8'>
        <div className='tablet:grid tablet:grid-cols-2 tablet:gap-6 tablet:items-start'>
          <div className='flex flex-col gap-4'>
            <MyBouquetInfo
              occasion={data.occasion}
              recipient={data.recipient}
              message={data.message}
            />
            <MyBouquetComposition flowers={data.flowers} />
            <MyBouquetPackaging wrapping={data.wrapping} />
          </div>
          <div className='flex flex-col gap-4'>
            <div className='info-border p-4'>
              <div className='px-micro'>
                <p className='text-title-md'>꽃다발 미리보기</p>
                <p className='mt-1 text-body-md text-gray-400 whitespace-pre-wrap'>
                  실제 꽃다발은 플로리스트가 더 예쁘게{'\n'}만들어 드려요.
                </p>
              </div>
              <div className='mt-3'>
                <BouquetPreviewSection
                  flowers={data.flowers}
                  layout={data.layout}
                  wrappingColor={data.wrapping.wrappingColor}
                  ribbonColor={data.wrapping.ribbonColor}
                />
              </div>
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
      </div>
    </div>
  );
}
