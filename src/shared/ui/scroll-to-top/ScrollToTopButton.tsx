'use client';

import { cn } from '@/shared/utils/styles';
import * as React from 'react';

type TProps = {
  /** 이 px 이상 스크롤되면 버튼 노출 */
  showAfterPx?: number
  /** 버튼 텍스트/아이콘 */
  children?: React.ReactNode
  className?: string
  /** 고정 위치 */
  position?: 'bottom-right' | 'bottom-left'
  /** 스크롤 컨테이너 셀렉터 (기본값: 부모에서 스크롤 가능한 요소 찾기) */
  scrollContainerSelector?: string;
  /** 부모 스크롤 컨테이너 자동 감지 사용 여부 (기본값: true) */
  useParentScroller?: boolean;
};

function prefersReducedMotion() {
  if (typeof window === 'undefined') {return true;}
  // OS 설정 단에서 동작줄이기 옵션 설정 반영(eg. macOS의 시스템 설정 > 접근성 > 동작줄이기 옵션)
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
}

export function ScrollToTopButton({
  showAfterPx = 300,
  children = null,
  className,
  position = 'bottom-right',
  scrollContainerSelector,
  useParentScroller = true,
}: TProps) {
  const [visible, setVisible] = React.useState(false);
  const scrollContainerRef = React.useRef<HTMLElement | null>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    // 1) 스크롤 컨테이너 찾기
    let scrollContainer: HTMLElement | null = null;

    if (scrollContainerSelector) {
      scrollContainer = document.querySelector(
        scrollContainerSelector,
      ) as HTMLElement | null;
    } else if (useParentScroller && buttonRef.current) {
      let parent = buttonRef.current.parentElement;
      while (parent) {
        const overflowY = window.getComputedStyle(parent).overflowY;
        if (overflowY === 'auto' || overflowY === 'scroll') {
          scrollContainer = parent;
          break;
        }
        parent = parent.parentElement;
      }
    }

    scrollContainerRef.current = scrollContainer;

    const target: HTMLElement | Window =
      scrollContainer ?? window;

    const onScroll = () => {
      const scrollTop =
        scrollContainer != null
          ? scrollContainer.scrollTop
          : window.scrollY;

      setVisible(scrollTop >= showAfterPx);
    };

    onScroll();
    target.addEventListener('scroll', onScroll, { passive: true });
    return () => target.removeEventListener('scroll', onScroll);
  }, [showAfterPx, scrollContainerSelector, useParentScroller]);

  const onClick = () => {
    const behavior: ScrollBehavior = prefersReducedMotion()
      ? 'auto'
      : 'smooth';
    const scrollContainer = scrollContainerRef.current;

    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior });
    } else {
      window.scrollTo({ top: 0, behavior });
    }
  };

  const pos =
    position === 'bottom-right'
      ? 'right-4 bottom-4'
      : 'left-4 bottom-4';

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      aria-label="Scroll to top"
      className={cn(
        'absolute z-float p-3 rounded-5',
        'bg-primary-400 text-white hover:bg-primary-600',
        pos,
        // 안 보일 때는 숨기기
        !visible && 'opacity-0 pointer-events-none',
        className,
      )}
    >
      {children}
    </button>
  );
}
