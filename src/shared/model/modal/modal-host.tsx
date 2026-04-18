'use client';

import { useAtomValue, useSetAtom } from 'jotai';
import React, { useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { modalStackAtom } from './modal.atoms';
import { TModalDescriptor, TModalProps } from './modal.types';
import { closeModalAtom } from './modal.actions';
import { applyAnchorPosition } from '@/shared/utils/anchor-position';

const POSITION_CLASSES: Record<string, string> = {
  center: 'items-center justify-center',
  right: 'items-stretch justify-end',
  bottom: 'items-end justify-center',
};

// --- AnchorModalItem ---

type AnchorModalItemProps = {
  descriptor: TModalDescriptor;
  onClose: () => void;
};

function AnchorModalItem({ descriptor, onClose }: AnchorModalItemProps) {
  const { id, component, anchor } = descriptor;
  const { el: anchorEl, position: anchorPosition = 'bottom-right', gap: anchorGap = 0 } = anchor ?? {};

  const refCallback = useCallback((node: HTMLDivElement | null) => {
    if (!node || !anchorEl) {return;}
    applyAnchorPosition(node, anchorEl, anchorPosition, anchorGap);
  }, [anchorEl, anchorPosition, anchorGap]);

  return createPortal(
    <>
      <div className='fixed inset-0 z-50' onClick={onClose} />
      <div ref={refCallback} className='fixed z-[51]'>
        {React.cloneElement(component, { modalId: id } as React.PropsWithChildren<TModalProps>)}
      </div>
    </>,
    document.body,
  );
}

// --- StandardModalItem ---

type StandardModalItemProps = {
  descriptor: TModalDescriptor;
  index: number;
  containerRef: React.RefObject<(HTMLDivElement | null)[]>;
  onBackgroundClick: (e: React.MouseEvent<HTMLDivElement>) => void;
};

function StandardModalItem({ descriptor, index, containerRef, onBackgroundClick }: StandardModalItemProps) {
  const { id, component, backgroundColor, position = 'bottom' } = descriptor;
  const positionClasses = POSITION_CLASSES[position] ?? POSITION_CLASSES.bottom;

  return (
    <div
      key={id}
      onClick={onBackgroundClick}
      className='fixed inset-0 z-50 flex animate-fade-in'
      style={{ backgroundColor: backgroundColor || '#00000033' }}
    >
      <div className={`flex w-full ${positionClasses}`}>
        <div ref={(el) => { containerRef.current[index] = el; }}>
          {React.cloneElement(component, { modalId: id } as React.PropsWithChildren<TModalProps>)}
        </div>
      </div>
    </div>
  );
}

// --- ModalHost ---

function ModalHost() {
  const stack = useAtomValue(modalStackAtom);
  const containerRef = useRef<(HTMLDivElement | null)[]>([]);
  const closeModal = useSetAtom(closeModalAtom);

  if (stack.length === 0) {return null;}

  return (
    <>
      {stack.map((descriptor, index) => {
        const canClose = !!descriptor.canCloseOnBackgroundClick;

        if (descriptor.position === 'anchor') {
          return (
            <AnchorModalItem
              key={descriptor.id}
              descriptor={descriptor}
              onClose={() => { if (canClose) {closeModal();} }}
            />
          );
        }

        const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
          const container = containerRef.current[index];
          if (!canClose || !container) {return;}
          if (e.target instanceof HTMLElement && container.contains(e.target)) {return;}
          closeModal();
        };

        return (
          <StandardModalItem
            key={descriptor.id}
            descriptor={descriptor}
            index={index}
            containerRef={containerRef}
            onBackgroundClick={handleBackgroundClick}
          />
        );
      })}
    </>
  );
}

export default ModalHost;
