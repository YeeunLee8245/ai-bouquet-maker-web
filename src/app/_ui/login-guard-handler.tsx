'use client';

import { useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { loginRequiredAtom } from '@/shared/model/login/login-guard.atoms';
import { openModalAtom } from '@/shared/model/modal';
import LoginRequiredModal, { LOGIN_REQUIRED_MODAL_ID } from '@/app/main/_ui/login-required-modal';

export default function LoginGuardHandler() {
  const [loginRequired, setLoginRequired] = useAtom(loginRequiredAtom);
  const openModal = useSetAtom(openModalAtom);

  useEffect(() => {
    if (!loginRequired.isRequired) { return; }
    openModal({
      id: LOGIN_REQUIRED_MODAL_ID,
      position: 'center',
      component: <LoginRequiredModal modalId={LOGIN_REQUIRED_MODAL_ID} nextPath={loginRequired.nextPath} />,
    });
    setLoginRequired({ isRequired: false });
  }, [loginRequired, openModal, setLoginRequired]);

  return null;
}
