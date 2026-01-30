'use client';

import { useAtomValue } from 'jotai';
import React from 'react';
import { modalStackAtom } from './modal.atoms';
import { TModalProps } from './modal.types';

function ModalHost() {
  const stack = useAtomValue(modalStackAtom);

  if (stack.length === 0) {
    return null;
  }

  return (
    <>
      {stack.map((descriptor) => {
        const { id, component } = descriptor;
        const position = descriptor.position || 'bottom';
        const positionClasses = position === 'center'
          ? 'items-center justify-center'
          : 'items-end justify-center';

        return (
          <div
            key={id}
            className='fixed inset-0 z-50 flex'
            style={{ backgroundColor: '#00000033' }}
          >
            <div className={`flex w-full ${positionClasses}`}>
              {
                React.cloneElement(
                  component,
                  { modalId: id } as React.PropsWithChildren<TModalProps>,
                )
              }
            </div>
          </div>
        );
      })}
    </>
  );
}

export default ModalHost;
