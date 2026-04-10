'use client';

import { useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { Button, withAsyncClick } from '@/shared/ui/button';
import { showToastAtom } from '@/shared/model/toast';
import {
  bouquetNameAtom,
  bouquetOccasionAtom,
  bouquetRecipientAtom,
  bouquetMessageAtom,
  bouquetFlowersAtom,
  bouquetPackagingColorAtom,
  bouquetRibbonColorAtom,
  canSaveBouquetAtom,
  bouquetValidationErrorAtom,
} from '@features/bouquet-form';
import { saveBouquet } from '@api/recipe-bouquet.api';
import { resetSelectedFlowersAtom } from '@/shared/model/selected-flowers';

const LoadingButton = withAsyncClick(Button);

export default function MakeBouquetButton() {
  const router = useRouter();
  const showToast = useSetAtom(showToastAtom);
  const canSave = useAtomValue(canSaveBouquetAtom);
  const firstError = useAtomValue(bouquetValidationErrorAtom);
  const name = useAtomValue(bouquetNameAtom);
  const occasion = useAtomValue(bouquetOccasionAtom);
  const recipient = useAtomValue(bouquetRecipientAtom);
  const message = useAtomValue(bouquetMessageAtom);
  const flowers = useAtomValue(bouquetFlowersAtom);
  const ribbonColor = useAtomValue(bouquetRibbonColorAtom);
  const packagingColor = useAtomValue(bouquetPackagingColorAtom);
  const resetSelectedFlowers = useSetAtom(resetSelectedFlowersAtom);

  const handleSave = async () => {
    if (!canSave) {
      if (firstError) { showToast({ message: firstError }); }
      return;
    }

    const recipeFlowers = flowers.flatMap((flower) =>
      flower.colorAndQuantities.map((cq) => ({
        flower_id: flower.id,
        // TODO: yeeun 의미 아이디 default 처리 필요
        flower_meaning_id: cq.meaningId ?? flower.meaningId,
        quantity: cq.quantity,
        color: cq.color,
      })),
    );

    const { data } = await saveBouquet({
      name,
      occasion: occasion ?? '',
      recipient: recipient ?? '',
      message: message ?? '',
      recipe: {
        flowers: recipeFlowers,
        wrapping: { ribbonColor, wrappingColor: packagingColor },
      },
    });
    resetSelectedFlowers();
    showToast({ message: '꽃다발이 저장되었습니다.' });
    router.push(`/my-bouquet/${data.id}`);
  };

  return (
    <LoadingButton
      size='lg'
      className='mt-6'
      onClick={handleSave}
      loadingText='저장 중...'
      errorText='네트워크 오류가 발생했습니다.'
    >
      꽃다발 저장
    </LoadingButton>
  );
}
