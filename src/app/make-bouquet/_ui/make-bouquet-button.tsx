'use client';

import { useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/button';
import { showToastAtom } from '@/shared/model/toast';
import {
  bouquetNameAtom,
  bouquetOccasionAtom,
  bouquetRecipientAtom,
  bouquetMessageAtom,
  bouquetFlowersAtom,
  canSaveBouquetAtom,
  firstValidationErrorAtom,
} from '../_model';
import { useState } from 'react';
import { isApiError } from '@/shared/api';
import { saveBouquet } from '../_api/bouquet-api';
import { bouquetRibbonColorAtom, bouquetPackagingColorAtom } from '../_model/bouquet-form.atoms';

export default function MakeBouquetButton() {
  const router = useRouter();
  const showToast = useSetAtom(showToastAtom);
  const canSave = useAtomValue(canSaveBouquetAtom);
  const firstError = useAtomValue(firstValidationErrorAtom);
  const name = useAtomValue(bouquetNameAtom);
  const occasion = useAtomValue(bouquetOccasionAtom);
  const recipient = useAtomValue(bouquetRecipientAtom);
  const message = useAtomValue(bouquetMessageAtom);
  const flowers = useAtomValue(bouquetFlowersAtom);
  const ribbonColor = useAtomValue(bouquetRibbonColorAtom);
  const packagingColor = useAtomValue(bouquetPackagingColorAtom);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!canSave || isLoading) {
      if (firstError) {
        showToast({ message: firstError });
      }
      return;
    }

    setIsLoading(true);

    const recipeFlowers = flowers.flatMap((flower) =>
      flower.colorAndQuantities.map((cq) => ({
        flower_id: flower.id,
        flower_meaning_id: flower.meaningId,
        quantity: cq.quantity,
        color: cq.color,
      })),
    );

    try {
      const {data} = await saveBouquet({
        name,
        occasion: occasion ?? '',
        recipient: recipient ?? '',
        message: message ?? '',
        recipe: {
          flowers: recipeFlowers,
          wrapping: {
            ribbonColor,
            wrappingColor: packagingColor,
          },
        },
      });

      showToast({ message: '꽃다발이 저장되었습니다.' });
      // TODO: yeeun 작성 완료 꽃다발 페이지로 이동
      router.push(`/my-bouquet/${data.id}`);
    } catch (error) {
      const msg = isApiError(error) ? error.message : '네트워크 오류가 발생했습니다.';
      showToast({ message: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      size='lg'
      className='mt-6'
      onClick={handleSave}
    >
      {isLoading ? '저장 중...' : '꽃다발 저장'}
    </Button>
  );
}
