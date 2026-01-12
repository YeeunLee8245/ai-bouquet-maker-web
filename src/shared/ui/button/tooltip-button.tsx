'use client';
import { useState, useCallback, useRef, useEffect, useEffectEvent } from 'react';
import { createPortal } from 'react-dom';
import TooltipIcon from '@/shared/assets/icons/tooltip.svg';
import { ITooltipButtonProps } from './types';

const MARGIN = 16; // 화면 경계 여백

function TooltipButton({ msg, position = 'bottom-right', scrollContainerElement }: ITooltipButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleOpenChange = (open: boolean) => () => {
    setIsOpen(open);
  };

  const tooltipRefCallback = useCallback((node: HTMLDivElement | null) => {
    if (!node || !triggerRef.current) {return;}

    // viewport 상 절대 위치, 크기
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = node.getBoundingClientRect();

    const pageWidth = document.body.clientWidth;// || window.innerWidth;

    let top = 0;
    let left = 0;

    // 상하 위치 계산
    if (position.startsWith('top')) {
      top = triggerRect.top - tooltipRect.height - 6;
    } else {
      top = triggerRect.bottom + 6;
    }

    // 좌우 위치 계산 및 경계 체크
    let maxWidth: number | undefined;

    if (position.endsWith('right')) {
      // right: 아이콘 왼쪽 끝에서 시작해서 오른쪽으로 확장
      left = triggerRect.left;

      // 오른쪽 경계를 먼저 체크
      if (left + tooltipRect.width > pageWidth) {
        // 오른쪽으로 넘치면 left position처럼 배치 (아이콘 오른쪽 끝에 맞춤)
        left = triggerRect.right - tooltipRect.width;

        // 그래도 왼쪽으로 넘치면 width 조정
        if (left < MARGIN) {
          left = MARGIN;
          // 사용 가능한 최대 너비 계산
          maxWidth = pageWidth - (MARGIN * 2);
        }
      }
    } else {
      // left: 아이콘 오른쪽 끝에서 시작해서 왼쪽으로 확장
      left = triggerRect.right - tooltipRect.width;

      // 왼쪽 경계를 먼저 체크
      if (left < MARGIN) {
        // 왼쪽으로 넘치면 right position처럼 배치 (아이콘 왼쪽 끝에서 시작)
        left = triggerRect.left;

        // 그래도 오른쪽으로 넘치면 width 조정
        if (left + tooltipRect.width > pageWidth) {
          left = MARGIN;
          // 사용 가능한 최대 너비 계산
          maxWidth = pageWidth - (MARGIN * 2);
        }
      }
    }

    // DOM에 직접 스타일 적용
    node.style.position = 'fixed';
    node.style.top = `${top}px`;
    node.style.left = `${left}px`;
    if (maxWidth) {
      node.style.maxWidth = `${maxWidth}px`;
    }

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
