'use client';

import { useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import MakeBouquetButton from './_ui/make-bouquet-button';
import {
  BouquetInfoContainer,
  BouquetCompositionContainer,
  BouquetPackagingContainer,
  BouquetSummaryContainer,
  BouquetPreviewContainer,
  initBouquetFlowersAtom,
  resetBouquetFormAtom,
} from '@features/bouquet-form';
import { selectedFlowersAtom } from '@/shared/model/selected-flowers';

function MakeBouquetPage() {
  const router = useRouter();
  const selectedFlowers = useAtomValue(selectedFlowersAtom);
  const initBouquetFlowers = useSetAtom(initBouquetFlowersAtom);
  const resetBouquetForm = useSetAtom(resetBouquetFormAtom);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (selectedFlowers.length === 0) {
      router.replace('/flower-directory');
      return;
    }
    initBouquetFlowers();
    return () => { resetBouquetForm(); };
  }, []);

  return (
    <div>
      <div className='pt-4 pb-2 mx-4 px-1'>
        <p className='text-title-lg'>꽃다발 만들기</p>
        <p className='mt-1 text-body-md text-gray-400 whitespace-pre-wrap'>
          {'특별한 마음을 담은 꽃다발을 직접\n구성해 보세요.'}
        </p>
      </div>
      <div className='pt-4 pb-8 px-4'>
        <BouquetInfoContainer />
        <BouquetCompositionContainer />
        <BouquetPackagingContainer />
        <BouquetSummaryContainer />
        <BouquetPreviewContainer />
        <MakeBouquetButton />
      </div>
    </div>
  );
}

export default MakeBouquetPage;
