'use client';

import { useAtomValue, useSetAtom } from 'jotai';
import React, { useRef } from 'react';
import { modalStackAtom } from './modal.atoms';
import { TModalDescriptor, TModalProps, TAnchorSide } from './modal.types';
import { closeModalAtom } from './modal.actions';

const POSITION_CLASSES: Record<string, string> = {
  center: 'items-center justify-center',
  right: 'items-stretch justify-end',
  bottom: 'items-end justify-center',
};

function getAnchorStyle(anchorEl: HTMLElement | null | undefined, anchorSide: TAnchorSide): React.CSSProperties {
  const rect = anchorEl?.getBoundingClientRect();
  if (!rect) {return {};}

  switch (anchorSide) {
    case 'bottom': return { top: rect.bottom, left: rect.left };
    case 'top':    return { bottom: window.innerHeight - rect.top, left: rect.left };
    case 'left':   return { top: rect.top, right: window.innerWidth - rect.left };
    case 'right':  return { top: rect.top, left: rect.right };
  }
}

type ModalItemProps = {
  descriptor: TModalDescriptor;
  index: number;
  containerRef: React.RefObject<(HTMLDivElement | null)[]>;
  onBackgroundClick: (e: React.MouseEvent<HTMLDivElement>) => void;
};

function AnchorModalItem({ descriptor, index, containerRef, onBackgroundClick }: ModalItemProps) {
  const { id, component, anchorEl, anchorSide = 'bottom' } = descriptor;
  const anchorStyle = getAnchorStyle(anchorEl, anchorSide);

  return (
    <div key={id} onClick={onBackgroundClick} className='fixed inset-0 z-50'>
      <div
        ref={(el) => { containerRef.current[index] = el; }}
        className='absolute'
        style={anchorStyle}
      >
        {React.cloneElement(component, { modalId: id } as React.PropsWithChildren<TModalProps>)}
      </div>
    </div>
  );
}

function StandardModalItem({ descriptor, index, containerRef, onBackgroundClick }: ModalItemProps) {
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

function ModalHost() {
  const stack = useAtomValue(modalStackAtom);
  const containerRef = useRef<(HTMLDivElement | null)[]>([]);
  const closeModal = useSetAtom(closeModalAtom);

  if (stack.length === 0) {return null;}

  return (
    <>
      {stack.map((descriptor, index) => {
        const canClose = !!descriptor.canCloseOnBackgroundClick;

        const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
          const container = containerRef.current[index];
          if (!canClose || !container) {return;}
          if (e.target instanceof HTMLElement && container.contains(e.target)) {return;}
          closeModal();
        };

        const props: ModalItemProps = { descriptor, index, containerRef, onBackgroundClick: handleBackgroundClick };

        return descriptor.position === 'anchor'
          ? <AnchorModalItem key={descriptor.id} {...props} />
          : <StandardModalItem key={descriptor.id} {...props} />;
      })}
    </>
  );
}

export default ModalHost;
