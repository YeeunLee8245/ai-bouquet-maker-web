import { useState, useCallback } from 'react';
import TooltipIcon from '@/shared/assets/icons/tooltip.svg';
import { ITooltipButtonProps, TooltipPosition } from './types';
// TODO: yeeun 스타일 수정 필요
const positionStyles: Record<TooltipPosition, string> = {
  'top-right': 'bottom-full mb-[6px]',
  'top-left': 'bottom-full mb-[6px]',
  'bottom-right': 'top-full mt-[6px]',
  'bottom-left': 'top-full mt-[6px]',
};

function TooltipButton({ msg, position = 'bottom-right' }: ITooltipButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [adjustedPosition, setAdjustedPosition] = useState<{ left?: string; right?: string }>({});

  const handleOpenChange = (open: boolean) => () => {
    setIsOpen(open);
  };

  const tooltipRefCallback = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      const rect = node.getBoundingClientRect();

      // 부모 페이지의 width 동적으로 가져오기
      const pageWidth = document.body.clientWidth || window.innerWidth;

      const newPosition: { left?: string; right?: string } = {};

      // 오른쪽 경계 체크
      if (rect.right > pageWidth) {
        newPosition.right = '0';
        newPosition.left = 'auto';
      } else if (rect.left < 0) {
        // 왼쪽 경계 체크
        newPosition.left = '0';
        newPosition.right = 'auto';
      } else {
        // 기본 위치
        if (position.includes('right')) {
          newPosition.left = '0';
        } else {
          newPosition.right = '0';
        }
      }

      setAdjustedPosition(newPosition);
    }
  }, [position]);

  return (
    <div
      onMouseEnter={handleOpenChange(true)}
      onMouseLeave={handleOpenChange(false)}
      onFocus={handleOpenChange(true)}
      onBlur={handleOpenChange(false)}
      className='relative inline-block'
    >
      <TooltipIcon />
      {/* {isOpen && ( */}
      <div
        ref={tooltipRefCallback}
        style={adjustedPosition}
        // box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.08);
        className={`
            absolute py-1 px-2 rounded-2 bg-gray-100 text-[#2B2D23] text-[12px] leading-4
            max-w-[200px] w-max whitespace-normal wrap-break-word
            box-shadow-[0_2px_2px_0_rgba(0,0,0,0.08)]
            z-50
            ${positionStyles[position]}
          `}
      >
        {msg}
      </div>
      {/* )} */}
    </div>
  );
}

export default TooltipButton;
