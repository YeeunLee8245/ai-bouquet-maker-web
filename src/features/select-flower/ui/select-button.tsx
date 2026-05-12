'use client';

import { useAtomValue, useSetAtom } from 'jotai';
import { Button } from '@/shared/ui/button';
import { selectedFlowersAtom, toggleFlowerAtom } from '@/entities/flower/model/selected-flowers';
import { loginRequiredAtom } from '@/shared/model/login/login-guard.atoms';
import { useUserAuth } from '@/hooks/use-supabase-user';

type TProps = {
  flowerId: string;
  flowerName: string;
};

function SelectButton({ flowerId, flowerName }: TProps) {
  const selectedFlowers = useAtomValue(selectedFlowersAtom);
  const toggleFlower = useSetAtom(toggleFlowerAtom);
  const setLoginRequired = useSetAtom(loginRequiredAtom);
  const { isLogin } = useUserAuth();
  const isSelected = selectedFlowers.some((f) => f.id === flowerId);

  const handleClick = () => {
    if (!isLogin) {
      setLoginRequired({ isRequired: true });
      return;
    }
    toggleFlower({ id: flowerId, name: flowerName });
  };

  return (
    <Button
      size='md'
      className={isSelected ? 'mt-3 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-600 hover:fill-gray-600' : 'mt-3'}
      onClick={handleClick}
    >
      {isSelected ? '선택 취소' : '선택하기'}
    </Button>
  );
}

export default SelectButton;
