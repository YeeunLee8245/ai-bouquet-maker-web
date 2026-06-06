'use client';

import { useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import MakeBouquetButton from './_ui/make-bouquet-button';
import {
  BouquetInfoContainer,
  BouquetCompositionContainer,
  BouquetPackagingContainer,
  BouquetSummaryContainer,
  BouquetPreviewInline,
  initBouquetFlowersAtom,
  applyAiResultToBouquetAtom,
  resetBouquetFormAtom,
  BOUQUET_FROM_AI_PARAM,
} from '@features/bouquet-form';
import { aiRecommendationResultAtom } from '@/entities/recommendation/model/recommendation-result.atoms';
import { selectedFlowersAtom } from '@/entities/flower/model/selected-flowers';

const FLOWERS_PARAM = 'flowers';

function MakeBouquetPage() {
  const aiResult = useAtomValue(aiRecommendationResultAtom);
  const selectedFlowers = useAtomValue(selectedFlowersAtom);
  const initBouquetFlowers = useSetAtom(initBouquetFlowersAtom);
  const applyAiResultToBouquet = useSetAtom(applyAiResultToBouquetAtom);
  const resetBouquetForm = useSetAtom(resetBouquetFormAtom);
  const setSelectedFlowers = useSetAtom(selectedFlowersAtom);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const flowerIdsFromUrl = params.get(FLOWERS_PARAM)?.split(',').filter(Boolean) ?? [];

    if (flowerIdsFromUrl.length > 0 && selectedFlowers.length === 0) {
      // 새로고침: URL에서 꽃 ID 복원
      setSelectedFlowers(flowerIdsFromUrl.map((id) => ({ id, name: '' })));
    } else if (selectedFlowers.length > 0 && !params.has(FLOWERS_PARAM)) {
      // 첫 진입: 현재 선택된 꽃 IDs를 URL에 기록
      params.set(FLOWERS_PARAM, selectedFlowers.map((f) => f.id).join(','));
      window.history.replaceState(null, '', `?${params.toString()}`);
    }

    initBouquetFlowers();

    // AI 추천 결과로 꽃다발 폼 정보 적용
    const fromAi = params.has(BOUQUET_FROM_AI_PARAM);
    if (fromAi && aiResult) {
      applyAiResultToBouquet({
        title: aiResult.title,
        occasion: aiResult.occasion,
        recipient: aiResult.recipient,
        message: aiResult.message,
      });
    }

    return () => { resetBouquetForm(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className='pt-4 pb-2 mx-4 px-1 tablet:mx-6 pc:mx-8'>
        <p className='text-title-lg'>꽃다발 만들기</p>
        <p className='mt-1 text-body-md text-gray-400 whitespace-pre-wrap'>
          {'특별한 마음을 담은 꽃다발을 직접\n구성해 보세요.'}
        </p>
      </div>
      <div className='pt-4 pb-8 px-4 tablet:px-6 pc:px-8'>
        <div className='tablet:grid tablet:grid-cols-2 tablet:gap-6 tablet:items-start'>
          <div>
            <BouquetInfoContainer />
            <BouquetCompositionContainer />
            <BouquetPackagingContainer />
          </div>
          <div className='flex flex-col'>
            <BouquetPreviewInline />
            <BouquetSummaryContainer />
            <MakeBouquetButton />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MakeBouquetPage;
