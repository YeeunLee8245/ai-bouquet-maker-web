'use client';

import { useAtomValue, useSetAtom } from 'jotai';
import { Button } from '@/shared/ui/button';
import { selectedFlowersAtom, toggleFlowerAtom } from '@/shared/model/selected-flowers';

type TProps = {
  flowerId: string;
  flowerName: string;
};

function SelectButton({ flowerId, flowerName }: TProps) {
  const selectedFlowers = useAtomValue(selectedFlowersAtom);
  const toggleFlower = useSetAtom(toggleFlowerAtom);
  const isSelected = selectedFlowers.some((f) => f.id === flowerId);

  return (
    <Button
      size='md'
      className={isSelected ? 'mt-3 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-600 hover:fill-gray-600' : 'mt-3'}
      onClick={() => toggleFlower({ id: flowerId, name: flowerName })}
    >
      {isSelected ? '선택 취소' : '선택하기'}
    </Button>
  );
}

export default SelectButton;
