'use client';

import { useRouter } from 'next/navigation';
import { useAtomValue, useSetAtom } from 'jotai';
import { selectedFlowersAtom } from '@/entities/flower/model/selected-flowers';
import { aiRecommendationResultAtom } from '@/entities/recommendation/model/recommendation-result.atoms';
import { showToastAtom } from '@/shared/model/toast';
import { loginRequiredAtom } from '@/shared/model/login/login-guard.atoms';
import { useUserAuth } from '@/hooks/use-supabase-user';
import { postUserSelection } from '@api/recommend-user-selection.api';
import { BOUQUET_FROM_AI_PARAM } from './bouquet-form.actions';

type TOptions = {
  fromAiPrompt?: boolean;
};

export function useMakeBouquet({ fromAiPrompt }: TOptions = {}) {
  const router = useRouter();
  const selectedFlowers = useAtomValue(selectedFlowersAtom);
  const aiResult = useAtomValue(aiRecommendationResultAtom);
  const showToast = useSetAtom(showToastAtom);
  const setLoginRequired = useSetAtom(loginRequiredAtom);
  const { isLogin } = useUserAuth();

  const handleMakeBouquet = () => {
    if (!isLogin) {
      setLoginRequired({ isRequired: true });
      return;
    }

    if (selectedFlowers.length === 0) {
      showToast({ message: '꽃을 1개 이상 선택해주세요.' });
      return;
    }

    if (fromAiPrompt && aiResult) {
      const flowerMeaningIds = selectedFlowers
        .map((sf) => aiResult.recommendations.find((r) => r.id === sf.id)?.flowerMeaningId)
        .filter((id): id is string => id !== undefined)
        .map(Number);
      if (flowerMeaningIds.length > 0) {
        postUserSelection(aiResult.recommendationId, flowerMeaningIds);
      }
      router.push(`/make-bouquet?${BOUQUET_FROM_AI_PARAM}`);
      return;
    }
    router.push('/make-bouquet');
  };

  return { handleMakeBouquet };
}
