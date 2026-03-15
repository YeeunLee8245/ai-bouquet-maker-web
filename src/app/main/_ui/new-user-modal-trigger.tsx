'use client';

import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { openModalAtom } from '@/shared/model/modal';
import NewUserWelcomeModal from './new-user-welcome-modal';

type TProps = {
  isNewUser: boolean;
};

function NewUserModalTrigger({ isNewUser }: TProps) {
  const openModal = useSetAtom(openModalAtom);

  useEffect(() => {
    if (!isNewUser) {return;}
    openModal({
      id: 'new-user-welcome',
      position: 'center',
      canCloseOnBackgroundClick: false,
      component: <NewUserWelcomeModal />,
    });
  }, [isNewUser, openModal]);

  return null;
}

export default NewUserModalTrigger;
