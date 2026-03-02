'use client';

import FlowerSearchSection from './_ui/flower-search-section';
import FlowerFavoritesSection from './_ui/flower-favorites-section';
import { closeModalAtom, TModalProps } from '@/shared/model/modal';
import { useAtomValue, useSetAtom } from 'jotai';
import { selectedFlowersAtom } from '@/shared/model/selected-flowers';
import { addBouquetFlowerAtom } from '../../../_model';
import { showToastAtom } from '@/shared/model/toast';
import { Button } from '@/shared/ui/button';
import BottomActionFooter from '@/widgets/footer/bottom-action-footer';

function FlowerAddModal({ modalId }: TModalProps) {
  const closeModal = useSetAtom(closeModalAtom);
  const selectedFlowers = useAtomValue(selectedFlowersAtom);
  const addBouquetFlower = useSetAtom(addBouquetFlowerAtom);
  const showToast = useSetAtom(showToastAtom);

  const handleConfirm = () => {
    let addedCount = 0;
    let duplicateCount = 0;

    for (const flower of selectedFlowers) {
      const added = addBouquetFlower({ flowerId: flower.id, name: flower.name });
      if (added) {
        addedCount++;
      } else {
        duplicateCount++;
      }
    }

    if (duplicateCount > 0 && addedCount === 0) {
      showToast({ message: '이미 추가된 꽃입니다.' });
    } else if (addedCount > 0) {
      showToast({ message: `${addedCount}종의 꽃이 추가되었습니다.` });
    }

    closeModal(modalId);
  };

  return (
    <div className='bg-gray-50 relative flex flex-col max-w-[360px] min-h-[624px] rounded-t-5'>
      <div className='w-full flex-1 px-4 pt-4 rounded-t-5'>
        <div className='flex justify-between px-micro'>
          <p className='text-title-md'>꽃 추가</p>
          <button
            type='button'
            className='text-ui-textbtn-md text-gray-400 hover:text-gray-500'
            onClick={() => closeModal(modalId)}
          >
            닫기
          </button>
        </div>
        <div className='pt-4 pb-6'>
          <FlowerSearchSection />
        </div>
        <FlowerFavoritesSection />
      </div>
      <BottomActionFooter>
        <Button size='lg' onClick={handleConfirm}>
          꽃다발 담기
        </Button>
      </BottomActionFooter>
    </div>
  );
}

export default FlowerAddModal;
