'use client';

import { useAtomValue, useSetAtom } from 'jotai';
import React, { useRef } from 'react';
import { modalStackAtom } from './modal.atoms';
import { TModalProps } from './modal.types';
import { closeModalAtom } from './modal.actions';

function ModalHost() {
  const stack = useAtomValue(modalStackAtom);
  const modalContainerRef = useRef<(HTMLDivElement | null)[]>([]);
  const closeModal = useSetAtom(closeModalAtom);

  if (stack.length === 0) {
    return null;
  }

  const handleBackgroundClick = (index: number, canClose: boolean) => (e: React.MouseEvent<HTMLDivElement>) => {
    const modalContainer = modalContainerRef.current[index];
    if (!canClose || !modalContainer) {return;}

    const { target } = e;
    if (target instanceof HTMLElement && modalContainer.contains(target)) {
      return;
    }
    closeModal();
  };

  return (
    <>
      {stack.map((descriptor, index) => {
        const { id, component } = descriptor;
        const position = descriptor.position || 'bottom';
        let positionClasses;

        switch (position) {
          case 'center':
            positionClasses = 'items-center justify-center';
            break;
          case 'right':
            positionClasses = 'items-stretch justify-end';
            break;
          default: // bottom
            positionClasses = 'items-end justify-center';
            break;
        }

        return (
          <div
            key={id}
            onClick={handleBackgroundClick(index, !!descriptor?.canCloseOnBackgroundClick)}
            className='fixed inset-0 z-50 flex animate-fade-in'
            style={{ backgroundColor: '#00000033' }}
          >
            <div className={`flex w-full ${positionClasses}`}>
              <div
                ref={(el) => { modalContainerRef.current[index] = el; }}
              >
                {
                  React.cloneElement(
                    component,
                    { modalId: id } as React.PropsWithChildren<TModalProps>,
                  )
                }
              </div>

            </div>
          </div>
        );
      })}
    </>
  );
}

export default ModalHost;
