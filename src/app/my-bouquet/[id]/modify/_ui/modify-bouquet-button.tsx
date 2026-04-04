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
import { updateBouquet } from '@api/recipe-bouquet.api';

const LoadingButton = withAsyncClick(Button);

type TProps = { id: string };

export default function ModifyBouquetButton({ id }: TProps) {
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

  const handleSave = async () => {
    if (!canSave) {
      if (firstError) { showToast({ message: firstError }); }
      return;
    }

    const recipeFlowers = flowers.flatMap((flower) =>
      flower.colorAndQuantities.map((cq) => ({
        flower_id: flower.id,
        flower_meaning_id: flower.meaningId,
        quantity: cq.quantity,
        color: cq.color,
      })),
    );

    await updateBouquet(id, {
      name,
      occasion: occasion ?? '',
      recipient: recipient ?? '',
      message: message ?? '',
      recipe: {
        flowers: recipeFlowers,
        wrapping: { ribbonColor, wrappingColor: packagingColor },
      },
    });

    showToast({ message: '꽃다발이 수정되었습니다.' });
    router.push(`/my-bouquet/${id}`);
  };

  return (
    <LoadingButton
      size='lg'
      className='mt-6'
      onClick={handleSave}
      loadingText='수정 중...'
      errorText='네트워크 오류가 발생했습니다.'
    >
      꽃다발 수정 완료
    </LoadingButton>
  );
}
