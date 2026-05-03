'use client';

import { useAtomValue, useSetAtom } from 'jotai';
import { Button } from '@/shared/ui/button';
import { selectedFlowersAtom, toggleFlowerAtom } from '@/entities/flower/model/selected-flowers';
import { openModalAtom } from '@/shared/model/modal';
import LoginRequiredModal, { LOGIN_REQUIRED_MODAL_ID } from '@/app/main/_ui/login-required-modal';
import { useUserAuth } from '@/hooks/use-supabase-user';

type TProps = {
  flowerId: string;
  flowerName: string;
};

function SelectButton({ flowerId, flowerName }: TProps) {
  const selectedFlowers = useAtomValue(selectedFlowersAtom);
  const toggleFlower = useSetAtom(toggleFlowerAtom);
  const openModal = useSetAtom(openModalAtom);
  const { isLogin } = useUserAuth();
  const isSelected = selectedFlowers.some((f) => f.id === flowerId);

  const handleClick = () => {
    if (!isLogin) {
      openModal({
        id: LOGIN_REQUIRED_MODAL_ID,
        position: 'center',
        component: <LoginRequiredModal modalId={LOGIN_REQUIRED_MODAL_ID} />,
      });
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
