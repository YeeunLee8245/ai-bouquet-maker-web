'use client';

import { useMemo, useState } from 'react';
import FlowerSearchSection from './_ui/flower-search-section';
import FlowerFavoritesSection from './_ui/flower-favorites-section';
import { closeModalAtom, TModalProps } from '@/shared/model/modal';
import { useAtomValue, useSetAtom } from 'jotai';
import { addBouquetFlowerAtom, bouquetFlowersAtom, removeBouquetFlowerByIdAtom } from '../../../model';
import { showToastAtom } from '@/shared/model/toast';
import { Button } from '@/shared/ui/button';
import { fetchSelectedFlowers } from '@api/recipe-bouquet.api';
import { isApiError } from '@/shared/api';
import BottomActionFooter from '@/widgets/footer/bottom-action-footer';
import { TSelectedFlower } from '@/entities/flower/model/selected-flowers';

function FlowerAddModal({ modalId }: TModalProps) {
  const closeModal = useSetAtom(closeModalAtom);
  const addBouquetFlower = useSetAtom(addBouquetFlowerAtom);
  const removeBouquetFlowerById = useSetAtom(removeBouquetFlowerByIdAtom);
  const showToast = useSetAtom(showToastAtom);

  // bouquetFlowersAtom에서 이미 추가된 꽃 목록 파생
  const bouquetFlowers = useAtomValue(bouquetFlowersAtom);
  const addedFlowers = useMemo<TSelectedFlower[]>(
    () => bouquetFlowers.map((f) => ({ id: f.id, name: f.name })),
    [bouquetFlowers],
  );

  // 모달 내부 선택 상태
  const [selectedInModal, setSelectedInModal] = useState<TSelectedFlower[]>([]);
  const [isConfirming, setIsConfirming] = useState(false);

  // 꽃 선택 종합 상태
  const totalSelectedFlowers = useMemo(
    () => [...addedFlowers, ...selectedInModal],
    [addedFlowers, selectedInModal],
  );

  const handleToggleFlower = (flower: { id: string; name: string }) => {
    // 모달 내부 선택 해제
    if (selectedInModal.some((f) => f.id === flower.id)) {
      setSelectedInModal((prev) => prev.filter((f) => f.id !== flower.id));
      return;
    }
    // 이미 추가된 꽃 중복 체크
    if (addedFlowers.some((f) => f.id === flower.id)) {
      showToast({ message: '이미 추가된 꽃이에요' });
      return;
    }
    setSelectedInModal((prev) => [...prev, flower]);
  };

  const handleRemoveFlower = (id: string) => {
    if (selectedInModal.some((f) => f.id === id)) {
      setSelectedInModal((prev) => prev.filter((f) => f.id !== id));
      return;
    }
    removeBouquetFlowerById(id);
  };

  const handleConfirm = async () => {
    if (selectedInModal.length === 0) {
      closeModal(modalId);
      return;
    }

    setIsConfirming(true);

    try {
      const ids = selectedInModal.map((f) => Number(f.id));
      const flowerDetails = await fetchSelectedFlowers(ids);

      let addedCount = 0;
      let duplicateCount = 0;

      for (const flower of flowerDetails) {
        const added = addBouquetFlower(flower);
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
    } catch (error) {
      const msg = isApiError(error) ? error.message : '꽃 정보 조회에 실패했습니다.';
      showToast({ message: msg });
    } finally {
      setIsConfirming(false);
      closeModal(modalId);
    }
  };

  const selectedIds = selectedInModal.map((f) => f.id);

  return (
    <div className='w-[360px] bg-gray-50 relative flex flex-col min-h-[624px] rounded-t-5'>
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
          <FlowerSearchSection
            selectedIds={selectedIds}
            onToggle={handleToggleFlower}
          />
        </div>
        <FlowerFavoritesSection
          selectedIds={selectedIds}
          onToggle={handleToggleFlower}
        />
      </div>
      <BottomActionFooter
        flowers={totalSelectedFlowers}
        onRemoveFlower={handleRemoveFlower}
      >
        <Button size='lg' onClick={handleConfirm} disabled={isConfirming}>
          {isConfirming ? '추가 중...' : '꽃다발 담기'}
        </Button>
      </BottomActionFooter>
    </div>
  );
}

export default FlowerAddModal;
