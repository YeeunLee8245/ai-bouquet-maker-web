'use client';

import { cloneElement, isValidElement, ReactElement } from 'react';
import { useSetAtom } from 'jotai';
import { openModalAtom, TModalId, TModalPosition } from '@/shared/model/modal';
import { useMediaQuery } from '@/shared/hooks/useMediaQuery';

type TProps = {
  modal: ReactElement;
  children: ReactElement;
  modalId: TModalId;
  mobilePosition?: TModalPosition;
  tabletPosition?: TModalPosition;
};

function ResponsiveModalTrigger({
  modal,
  children,
  modalId,
  mobilePosition = 'bottom',
  tabletPosition = 'center',
}: TProps) {
  const isTabletUp = useMediaQuery('(min-width: 768px)');
  const openModal = useSetAtom(openModalAtom);

  if (!isValidElement(children)) {
    throw new Error('ResponsiveModalTrigger: children must be a single React element');
  }

  return cloneElement(children as ReactElement<{ onClick?: () => void }>, {
    onClick: () => openModal({
      id: modalId,
      component: modal,
      position: isTabletUp ? tabletPosition : mobilePosition,
    }),
  });
}

export default ResponsiveModalTrigger;
