'use client';
import { useState, useCallback, useRef, useEffect, useEffectEvent } from 'react';
import { createPortal } from 'react-dom';
import TooltipIcon from '@/shared/assets/icons/tooltip.svg';
import { ITooltipButtonProps } from './types';
import { applyAnchorPosition } from '@/shared/utils/anchor-position';

function TooltipButton({ msg, position = 'bottom-right', scrollContainerElement }: ITooltipButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleOpenChange = (open: boolean) => () => {
    setIsOpen(open);
  };

  const tooltipRefCallback = useCallback((node: HTMLDivElement | null) => {
    if (!node || !triggerRef.current) {return;}
    applyAnchorPosition(node, triggerRef.current, position);
  }, [position]);

  const handleScroll = useEffectEvent(() => {
    setIsOpen(false);
  });

  useEffect(() => {
    if (!isOpen) {return;}
    const scrollContainer = scrollContainerElement ? scrollContainerElement : document.body;
    scrollContainer?.addEventListener('scroll', handleScroll);
    return () => {
      scrollContainer?.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen, scrollContainerElement]);

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleOpenChange(true)}
        onMouseLeave={handleOpenChange(false)}
        onFocus={handleOpenChange(true)}
        onBlur={handleOpenChange(false)}
        className='relative inline-block cursor-pointer'
      >
        <TooltipIcon />
      </div>
      {isOpen && createPortal(
        <div
          ref={tooltipRefCallback}
          className={`
            py-1 px-2 rounded-2 bg-gray-100 text-[#2B2D23] text-[12px] leading-4
            max-w-[200px] w-max whitespace-normal wrap-break-word
            shadow-[0_2px_2px_0_rgba(0,0,0,0.08)]
            z-tooltip
          `}
        >
          {msg}
        </div>,
        document.body,
      )}
    </>
  );
}

export default TooltipButton;
