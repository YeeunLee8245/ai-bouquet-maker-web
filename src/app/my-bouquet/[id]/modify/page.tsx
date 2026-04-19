'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSetAtom } from 'jotai';
import {
  BouquetInfoContainer,
  BouquetCompositionContainer,
  BouquetPackagingContainer,
  BouquetSummaryContainer,
  BouquetPreviewContainer,
  initBouquetFormFromDetailAtom,
  resetBouquetFormAtom,
} from '@features/bouquet-form';
import { useBouquetDetailQuery } from '../_model/use-bouquet-detail-query';
import BouquetDetailSkeleton from '../_ui/bouquet-detail-skeleton';
import ModifyBouquetButton from './_ui/modify-bouquet-button';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';

const MyBouquetModifyPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useBouquetDetailQuery(id);
  const initForm = useSetAtom(initBouquetFormFromDetailAtom);
  const resetForm = useSetAtom(resetBouquetFormAtom);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (data && !isInitialized) {
      initForm(data);
      setIsInitialized(true);
    }
    return () => {
      resetForm();
      setIsInitialized(false);
    };
  }, [data]);

  if (isLoading || !isInitialized) {
    return <BouquetDetailSkeleton />;
  }

  if (isError) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[50vh] gap-4'>
        <p className='text-body-md text-gray-400'>꽃다발을 찾을 수 없습니다.</p>
        <Button size='sm' asChild>
          <Link href='/main'>메인으로 돌아가기</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className='pt-4 pb-2 mx-4 px-1'>
        <p className='text-title-lg'>꽃다발 수정</p>
        <p className='mt-1 text-body-md text-gray-400 whitespace-pre-wrap'>
          {'저장된 꽃다발 정보를 수정할 수 있어요.'}
        </p>
      </div>
      <div className='pt-4 pb-8 px-4'>
        <BouquetInfoContainer />
        <BouquetCompositionContainer />
        <BouquetPackagingContainer />
        <BouquetSummaryContainer />
        <BouquetPreviewContainer />
        <ModifyBouquetButton id={id} />
      </div>
    </div>
  );
};

export default MyBouquetModifyPage;
